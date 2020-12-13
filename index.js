const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const https = require("https");
var unirest = require("unirest");

require('dotenv').config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
    dateStrings: 'date'
});

connection.connect((err) => {
    if (err) {
        console.log("Error in Connecting Database");
        throw error;
    }
    else {
        console.log("Connected to Database");
    }
});

var temp;
var imageURL;

function getWeather() {
    const appid = process.env.APP_ID;
    const query = "mysore";
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
            });
        }
    });
}

getWeather();

app.get('/', (req, res) => {
    getWeather();

    connection.query('select * from review, (select round(avg(stars)) average from review where place = ?) t where place = ?', ['overall', 'overall'], (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            // console.log('Params: ', id, places[id]);
            console.log(rows);
            res.render('index', { temp, imageURL, rows });
        }
    });

});

app.get('/destination', (req, res) => {
    getWeather();

    connection.query('select * from destination', (err, rows, fields) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('destination', { id: "Destination", temp, imageURL, rows });
        }
    });
});

app.get('/places/:id', (req, res) => {
    // console.log('Params: ', req.params.id);
    getWeather();

    var id = req.params.id;

    connection.query('select * from review, (select ceil(avg(stars)) average from review where place = ?) t where place = ?', [id, id], (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            // console.log('Params: ', id, places[id]);

            connection.query('select * from destination where name = ?', [id], (err, place, fields) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('places', { id, temp, imageURL, place: place[0], rows });
                }
            });
        }
    });
});

/**************Hotel API******************* */
app.get('/accommodation', (request, response) => {
    var req = unirest("GET", "https://hotels-com-free.p.rapidapi.com/srle/listing/v1/brands/hotels.com");

    req.query({
        "checkIn": "2021-01-27",
        "checkOut": "2021-01-28",
        "lat": "12.311827",
        "lon": "76.652985",
        "locale": "en_US",
        "rooms": "1",
        "currency": "INR",
        "sortOrder": "STAR_RATING_HIGHEST_FIRST",
        "pageNumber": "1"
    });

    req.headers({
        "x-rapidapi-key": process.env.HOTEL_API,
        "x-rapidapi-host": "hotels-com-free.p.rapidapi.com",
        "useQueryString": true
    });


    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        var hotelRes = res.body.data.body.searchResults
        console.log(res.body.data.body.searchResults);
        response.render('accomodation', { id: "Accommodation", temp, imageURL, hotelRes });
    });

});

app.post('/review', (req, res) => {
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var stars = parseInt(req.body.stars);
    var message = req.body.message;
    var place = req.body.place;

    connection.query('insert into review (name, email, message, stars, place) values (?, ?, ?, ?, ?)', [name, email, message, stars, place], (err) => {
        if (err)
            console.log(err);
        else {
            console.log('Review Added Succesfully');

            if (place != 'overall')
                res.redirect('/places/' + place);
            else
                res.redirect('/');
        }
    });
});

app.get('/transport', (req, res) => {
    res.render('transport', { id: 'Transportation', temp, imageURL });
});

app.post('/suggests', (req, res) => {
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    connection.query('insert into suggests (name, email, message) values (?, ?, ?)', [name, email, message], (err) => {
        if (err)
            console.log(err);
        else {
            console.log('Submitted Succesfully');
            res.redirect('/');
        }
    });
});

app.post("/newsletter", function (req, res) {
    const Name = req.body.name.split(" ");
    const email = req.body.email;
    const firstName = Name[0];
    const lastName = Name[1];
    //creating data object to be posted to mailchimp
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    //mailchimp list id
    const list_id = process.env.LISTID;
    //mailchimp API url
    const url = "https://us18.api.mailchimp.com/3.0/lists/" + list_id;
    //options for https.request
    const options = {
        method: "POST",
        auth: process.env.NL_KEY                       //username can be anything like jay29 and password is api key of mailchimp
    }


    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.redirect('/');
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        console.log(response.statusCode);
    });
    //writing data entered by user to request given to mailchimp
    request.write(jsonData);
    //to say that we have done
    request.end();
});

app.get("/flight", (req, res) => {
    res.render('bestfly', { id: "Travel by Air", temp, imageURL, flight: undefined, carrier: undefined, places: undefined, errmsg: undefined, departDate: undefined });
});

app.post("/flight", (request, response) => {
    var sourceDes = request.body.code.toUpperCase();
    var departDate = request.body.depdate;
    var returnDate = request.body.retDate;
    console.log(sourceDes, departDate, returnDate);

    var req = unirest("GET", "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/in/inr/en-US/" + sourceDes + "-sky/myq-sky/" + departDate);

    req.headers({
        "x-rapidapi-key": process.env.FLIGHTAPI,
        "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "useQueryString": true
    });


    req.end(function (res) {
        if (res.error) {
            response.render('bestfly', { id: "Travel by Air", temp, imageURL, flight: undefined, carrier: undefined, places: undefined, errmsg: "Incorrect Airport Code !! Try Again", departDate: undefined });
        }
        else if (res.body.Quotes.length == 0) {
            response.render('bestfly', { id: "Travel by Air", temp, imageURL, flight: undefined, carrier: undefined, places: undefined, errmsg: "Flights Not Found !! Try Another Date", departDate: undefined });
        }
        else {
            console.log(res.body);
            response.render('bestfly', { id: "Travel by Air", temp, imageURL, flight: res.body.Quotes[0], carrier: res.body.Carriers[0], places: res.body.Places, errmsg: undefined, departDate: departDate });
        }
    });

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.get("/food", (req, res) => {
    res.render("food", { id: 'Food', temp, imageURL });
});
var food_items_list = {
    "Mysore Pak": {
        "name": "Mysore Pak",
        "imagel": "/images/mysore-pak.jpg",
        "info": "Historically known as Mysore Paaka, this incredibly sweet and incredibly delicious item was invented at the Mysore Palace at the time of the rule of Krishna Raja Wadiyar IV. Kakasura Madappa, a gifted royal chef, was the first to make this sweet.It is made using generous amounts of ghee, sugar, gram flour, and (occasionally) cardamom. Similar in texture to fudge, it is the most revered dessert in Mysore, served in most restaurants and sweet marts by the kilo. You’ve absolutely got to take some home.",
        "price": "A kilo of Mysore Pak will cost you about Rs.400.",
        "where": "Guru Sweet Mart on Sayyaji Rao Road",
        "recipe": "https://www.youtube.com/watch?v=2E4GG6p48L0"
    },

    "Idli": {
        "name": "Idli",
        "imagel": "/images/idli.jpg",
        "info": "Idlis are steamed rice cakes that are generally served with a spicy lentil soup and coconut chutney (the spiciness of which varies). A favourite with the local crowd, idlis are mostly a breakfast item, though you’ll find many people eating them at all times of the day.        In Mysore, you can see them being served in restaurants as well as on food carts in the market and commercial areas. Although it is generally made with rice, you’ll also find shops selling idlis made of semolina or even jackfruit. Some shops will also fry the idli (not traditional, but delicious).",
        "price": "Idlis are cheap, in the range of Rs. 20 to Rs. 60 a plate, depending on where they’re eaten.",
        "where": "Vinayaka Mylari in Doora.",
        "recipe": "https://www.youtube.com/watch?v=xU5T4oZOcNw"
    },

    "Vada": {
        "name": "Vada",
        "imagel": "/images/vada.jpg",
        "info": "Vada is made from a mixture of black gram (lentil) flour, cumin, curry leaves, sometimes onions and chilli, and is deep-fried to a crispy crust.  Like the idli, vada is served with a spicy lentil soup (sambar) and coconut chutney. The idli-vada combination (with one idli and one vada) is very popular for breakfast or for tea-time snacks.",
        "price": "Prices of vadas lie in the range of Rs. 20 to Rs. 60 a plate.",
        "where": "Nalpak, Vani Vilas Mohalla, Gokulam",
        "recipe": "https://www.youtube.com/watch?v=Zjm9fQBBHiM"
    },

    "Bonda": {
        "name": "Bonda",
        "imagel": "/images/bonda.jpg",
        "info": "Bonda, a ball-shaped pakoda or dumpling commonly eaten for breakfast or lunch. In Mysore, a famous variation is a potato (aloo) bonda (it made using mashed potato).      Just like other breakfast local delicacies available here, Bonda is served with sambar and coconut chutney. A morning breakfast of Bonda is incomplete without a piping hot cup of tea.",
        "price": "A plate of Bonda costs around Rs.35 a plate",
        "where": "Suvarna Bhawan, Kuvempunagar",
        "recipe": "https://www.youtube.com/watch?v=OCES0Ynt5cY"
    },

    "Khara Bath": {
        "name": "Khara Bath",
        "imagel": "/images/Khara Bath.jpg",
        "info": "Khara Bath, also known as Upma or Uppittu, is a typical South Indian breakfast delicacy. It is made from semolina and is roasted with vegetables and spices and topped with cashew nuts.      It is just like a savoury porridge and is usually prepared with only a few spices. Khara Bath can also be eaten with coconut chutney.",
        "price": "Around Rs.40 a plate.",
        "where": "Om Shanthi, Nazarbad",
        "recipe": "https://www.youtube.com/watch?v=OXuH-G_-FDU"
    },

    "Uttapam": {
        "name": "Uttapam",
        "imagel": "/images/Uttapam.jpg",
        "info": "Uttapam is a thick rice pancake usually cooked with vegetables. Prepared on the spot, it is best eaten immediately (or it will be too soggy). Have it topped with onions or tomatoes, which are the most popular versions of the dish, and sprinkled with podi. A variation on the dosa, it’s a must-try.",
        "price": "Between Rs.40 and Rs.100",
        "where": "Anima Madhva Bhavan, Vontikoppal,Vani Vilas Mohalla, Mysore",
        "recipe": "https://www.youtube.com/watch?v=2IMWlViah88"
    },
    "Poori Saagu": {
        "name": " Poori Saagu",
        "imagel": "/images/Poori Sagu.jpg",
        "info": "Poori is served for breakfast throughout India, in different variations. In Mysore, poori (or puri) saagu is what it is called. The dish consists of a soft, deep-fried puffed puri served with a flavourful vegetable curry. ",
        "price": "Between Rs.35 and Rs.80 a plate.",
        "where": "Vinayaka Mylari, Doora",
        "recipe": "https://www.youtube.com/watch?v=XEs84VCZlYc"
    },
    "Shavige Bath": {
        "name": "Shavige Bath",
        "imagel": "/images/Shavige-Uppittu.jpg",
        "info": "Although it looks like upma/kesari bath, Shavige bath has a different base ingredient. It is made from thin and light vermicelli, mixed with vegetables and nuts, and for flavour curry leaves, mustard seeds and turmeric are added. This light-on-the-tummy breakfast is usually served with coconut chutney.",
        "price": "Rs. 40 a plate",
        "where": "Gayatri tiffin room, Ittige Gudu",
        "recipe": "https://www.youtube.com/watch?v=kRL0Jy8qhBg"
    },
    "Payasam": {
        "name": "Payasam",
        "imagel": "/images/payasam.jpg",
        "info": "A creamy rice pudding that’s flavoured with cardamom and topped generously with nuts, the South Indians call it Payasam. It’s a great dessert at any time of the year, but is typically eaten only on grand occasions, such as weddings and big festivals.",
        "price": "Rs. 50 to Rs. 125 a plate",
        "where": "Anima Bhavan, Kalidasa Road, Near Reliance Fresh",
        "recipe": "https://youtu.be/klB-XIjmDck"
    }
};
app.get("/food-item/:id", (req, res) => {
    var id = req.params.id;
    res.render("food-items", { id: food_items_list[id].name, temp, imageURL, item: food_items_list[id] });
});

app.get("/culture", (req, res) => {
    res.render("culture", { id: "Mysuru Culture", temp, imageURL });
});

app.listen(3000, function () {
    console.log("app started at http://localhost:3000/")
});




/** */