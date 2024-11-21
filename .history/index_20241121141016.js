require('dotenv').config(); //load env variables

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
//const port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views', './views');

//Middleware
app.use(session({
    //secret: process.env.SESSION_SECRET || 'default',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
}));

app.use(passport.initialize());
app.use(passport.session());

//Initialize passport
passport.serializeUser((user, done)=> done(null,user));
passport.deserializeUser((user, done)=> done(null,user));

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    //clientID: process.env.GOOGLE_CLIENT_ID, // Replace with your Client ID
    //clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your Client Secret
    //callbackURL: process.env.GOOGLE_CALLBACK_URL, // Callback URL
}, (accessToken, refreshToken, profile, done) => {
    // You can save user info in a database here
    return done(null, profile);
}));

// Google OAuth routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to home.
        res.redirect('/');
    }
);

// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Serve your HTML file or render views
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});


// Start the server
app.listen(port, () => console.log('Server is running on http://localhost:3000'));