const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

require('dotenv').config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/destination', (req, res) => {
    res.sendFile(__dirname + '/public/destination.html');
});

app.get('/places/:id', (req, res) => {
    // console.log('Params: ', req.params.id);
    var id = req.params.id;
    res.render('places', { id });
});

app.listen(3000, function () {
    console.log("app started at http://localhost:3000/")
});