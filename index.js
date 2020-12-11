const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const https = require("https");

require('dotenv').config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

var temp;
var imageURL;

function getWeather() {
    const appid = "2cb65000c7edcba65515cd6387b0130f";
    const query = "Mysore";
    console.log(query);
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + appid + "&q=" + query + "&units=" + unit; //url for weather API
    //https.get to send get req to url
    https.get(url, function (response) {

        console.log(response.statusCode); //accessing statusCode
        if (response.statusCode === 404) {
            res.send("Page not found");
        }
        else {
            response.on("data", function (data) { //capturing data
                const weatherData = JSON.parse(data);
                temp = weatherData.main.temp;
                const weatherDes = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                console.log(temp, imageURL);
            });
        }
    });
}
getWeather();
app.get('/', (req, res) => {
    getWeather();
    res.render('index', { temp, imageURL });
});

app.get('/destination', (req, res) => {
    getWeather();
    res.render('destination', { temp, imageURL });
});

app.get('/places/:id', (req, res) => {
    // console.log('Params: ', req.params.id);
    getWeather();
    var id = req.params.id;
    res.render('places', { id, temp, imageURL });
});

app.listen(3000, function () {
    console.log("app started at http://localhost:3000/")
});