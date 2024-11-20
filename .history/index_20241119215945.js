const express = require('express');
const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: 'Game Awards Gamblin', message: 'Hello, World!' });
});

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});