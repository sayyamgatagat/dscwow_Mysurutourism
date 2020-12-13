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
    res.render('destination', { id: "Destination", temp, imageURL });
});

var places = {
    "Mysuru Palace": {
        "name": "Mysuru Palace",
        "imagel": "/images/blobpalace.png",
        "info": "The Mysore Palace is a historical palace and the royal residence at Mysore in the Indian State of Karnataka. It is the official residence of the Wadiyar dynasty and the seat of the Kingdom of Mysore. The palace is in the centre of Mysore, and faces the Chamundi Hills eastward. Mysore is commonly described as the 'City of Palaces', and there are seven palaces including this one; however, 'Mysore Palace' refers specifically to this one within the Old fort. The land on which the palace now stands was originally known as puragiri (literally, citadel), and is now known as the Old Fort. Yaduraya built the first palace inside the Old Fort in the 14th century, which was demolished and constructed multiple times. The current structure was constructed between 1897 and 1912, after the Old Palace was burnt ablaze. Mysore Palace is now one of the most famous tourist attractions in India, after the Taj Mahal, with more than 6 million annual visitors.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.674321123399!2d76.65298621463789!3d12.305162991295514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf701103f9a1f9%3A0xc37fbae2a124da0d!2sMysore%20Palace!5e1!3m2!1sen!2sin!4v1607718078460!5m2!1sen!2sin"
    },

    "Brindavan Gardens": {
        "name": "Brindavan Gardens",
        "imagel": "/images/blobbrindavan.png",
        "info": "The Brindavan Gardens is a garden located in the Mandya District of the Indian State of Karnataka. It lies adjoining the Krishnarajasagara Dam which is built across the river Kaveri.[1] The work on laying out this garden was started in the year 1927 and completed in 1932.[2][3] Visited by close to 2 million tourists per year, the garden is one of the major attractions of Srirangapatna.[4] Sir Mirza Ismail, the Deewan of Mysore, a man with a penchant for gardens, founded the Brindavan Gardens (Krishnaraja Sagar Dam in particular) and built the Cauvery River high-level canal to irrigate 120,000 acres (490 km2) in modern Mandya district. He was inspired by Hyder Ali who had earlier built the Lalbagh Botanical Gardens at Bangalore.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3896.419951735979!2d76.57059751463912!3d12.421715591218256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf78e109feca5d%3A0x915fba7ee0e6b6b2!2sBrindavan%20Gardens!5e0!3m2!1sen!2sin!4v1607717897464!5m2!1sen!2sin"
    },

    "Shri Chamnudeshwari Temple": {
        "name": "Shri Chamnudeshwari Temple",
        "imagel": "/images/blobtemple.png",
        "info": "Sri Chamundeshwari Temple is about 13 kms from Mysuru, which is a prominent city in Karnataka State, India. Sri Chamundeshwari Temples is famous not only in India but also abroad. Atop of the hill the famous Sri Chamundeswari Temple. ‘Chamundi’ or ‘Durga’ is the fierce form of ‘Shakti’. She is the slayer of demons, ‘Chanda’ and ‘Munda’ and also ‘Mahishasura’, the buffalow-headed monster. She is the tutelary deity of the Mysuru Maharajas and the presiding deity of Mysuru. For several centuries they have held the Goddess, Chamundeswari, in great reverence. ‘Skanda Purana’ and other ancient texts mention a sacred place called ‘Trimuta Kshetra’ surrounded by eight hills. Lying on the western side is the Sri Chamundeshwari Temples, one among the eight hills. In the earlier days, the Hill was identified as ‘Mahabaladri’ in honour of God Shiva who resides in the ‘Mahabaleswara Temple’. This is the oldest temple on the hills. In the later days, the hill came to be known as ‘Sri Chamundeshwari Temples’ in honour of the Goddess Chamundi, the chief subject of the ‘Devi Mahathme’. The Goddess is believed to be an incarnation of Parvati, the consort of Lord Shiva. A large number of devotees from all over the country and from abroad visit the temple every year. They believe that the Goddess fulfills their desires and aspirations. Sri Chamundeshwari Temples rises to a height of 3,489 feet MSL and is visible from a distance itself while traveling towards Mysuru. There is a good motorable road to the top. Besides from Mysuru side, there is also a motorable road from its rear side, the Nanjangud side. Bus facilities are available to visit the hills. Karnataka State Road Transport Corporation (KSRTC) operates regular bus services every day for the convenience of pilgrims and others. A temple of great antiquity with over 1,000 years of background, it was a small shrine initially and assuming importance over the centuries it became a big temple as seen today. It assumed significance after the Mysuru Maharajas, the Wodeyars, came to power in 1399 A.D., great devotees and worshippers of the Devi, Chamundeswari became their home deity and thus assumed religious prominance.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.2382319036087!2d73.8070470147225!3d18.63320838734347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b845b3d20dfb%3A0x813caf1c1d9ccec8!2sShree%20Chamundeshwari%20Temple!5e1!3m2!1sen!2sin!4v1607717998397!5m2!1sen!2sin"
    },

    "Sri Chamarajendra Zoological Gardens": {
        "name": "Sri Chamarajendra Zoological Gardens",
        "imagel": "/images/blobzoo.png",
        "info": "Mysore Zoo was created from the private menagerie of Maharaja Sri Chamaraja Wodeyar in 1892, on 10 acres (4.0 ha) of the summer palace. Over the next 10 years the zoo was expanded to 45 acres (18 ha) with spacious enclosures that are still in use.[2] The Zoo's original founder, Sri Chamaraja Wodeyar Originally called the Palace Zoo, it was renamed \"Chamarajendra Zoological Gardens\" in 1909. Mr. A.C. Hughes, from South Wales, was the zoo's first superintendent. He served as the superintendent from 1892 to 1924. Hughes, Sir Mirza Ismail, and G.H. Krumbiegel worked towards refashioning the zoo and updating it with modern, natural enclosures. It now includes a bandstand and an artificial lake. It was given to the Department of Parks and Gardens of the Mysore State Government in 1948. The zoo was expanded first with another 50 acres (20 ha), and then another 150 acres (61 ha) with the acquisition of the Karanji Tank (Karanji reservoir), in which an artificial island has been created as a sanctuary for birds.[2] The zoo was handed over to the Forest Department in 1972, and was entrusted to Zoo Authority of Karnataka (the first autonomous organization in India to manage a zoo) in 1979.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.715575636642!2d76.66199951463778!3d12.302205691297546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7023040e7795%3A0xea57334ccb6cbfcb!2sSri%20Chamarajendra%20Zoological%20Gardens!5e1!3m2!1sen!2sin!4v1607718045204!5m2!1sen!2sin"
    },

    "St. Philomena's Cathedral": {
        "name": "St. Philomena's Cathedral",
        "imagel": "/images/blobcath.png",
        "info": "St. Philomena’s Cathedral is a Catholic church that is the cathedral of the Diocese of Mysore, India. The full name is the Cathedral of St. Joseph and St. Philomena. It is also known as St. Joseph's Cathedral.[3][4][5] It was constructed in 1936 using a Neo Gothic style and its architecture was inspired by the Cologne Cathedral in Germany.[6] This is one of the tallest churches in Asia. A church at the same location was built in 1843 by Maharaja Mummadi Krishnaraja Wodeyar. An inscription which was there at the time of laying the foundation of the present church in 1933 states: \"In the name of that only God - the universal Lord who creates, protects, and reigns over the universe of Light, the mundane world and the assemblage of all created lives - this church is built 1843 years after the incarnation of Jesus Christ, the Enlightenment of the World, as man\".",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.9219274773345!2d76.656074814638!3d12.321041691285037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf706ecbc32f59%3A0x8e900b9cb740e32d!2sSt.%20Philomena&#39;s%20Cathedral!5e0!3m2!1sen!2sin!4v1607750972177!5m2!1sen!2sin"
    },

    "Kishkindha Moolika Bonsai Garden": {
        "name": "Kishkindha Moolika Bonsai Garden",
        "imagel": "/images/blobbonsai.png",
        "info": "Kishkinda Moolika Bonsai Garden is a famous garden located in Mysore, Karnataka. It is a part of the Avadhoota Datta Peetham founded by His Holiness Sri Ganapathi Sachchidananda Swamiji and is well-known for its numerous varieties of bonsai plants. It is a favorite spot for many nature lovers in the city and makes for a very good education trip to take with your kids. The bonsai garden was established in 1986 in Mysore by Swamiji as a part of the ashram. He saw bonsai as a mystic enterprise – “a rare human endeavor that has held me in awe and introspecting over years. In the miniature plant lives a grand life. It reflects the cosmic creation, the play of celestial paradoxes near, yet far, more, yet less, known, yet unknown, Small yet Big”. Though it started out as a small project, the garden quickly grew over the next decades, becoming a major attraction at the ashram. At present, it is spread over 4 acres.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.962003469606!2d76.65581201463769!3d12.284526091309207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf6fe4232c14bf%3A0xb60ece94f134f4ae!2sKishkindha%20Moolika%20Bonsai%20Garden!5e1!3m2!1sen!2sin!4v1607718193087!5m2!1sen!2sin"
    }
};


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

})


app.get('/places/:id', (req, res) => {
    // console.log('Params: ', req.params.id);
    getWeather();

    var id = req.params.id;

    connection.query('select * from review, (select ceil(avg(stars)) average from review where place = ?) t where place = ?', [id, id], (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            // console.log('Params: ', id, places[id]);
            res.render('places', { id, temp, imageURL, place: places[id], rows });
        }
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
    res.render('bestfly', { id: "Travel by Air", temp, imageURL, flight: undefined, carrier: undefined, places: undefined, errmsg: undefined , departDate : undefined});
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
            response.render('bestfly', { id: "Travel by Air", temp, imageURL, flight: undefined, carrier: undefined, places: undefined, errmsg: "Incorrect Airport Code !! Try Again" ,departDate : undefined});
        }
        else if (res.body.Quotes.length == 0) { 
            response.render('bestfly', { id: "Travel by Air", temp, imageURL, flight: undefined, carrier: undefined, places: undefined, errmsg: "Flights Not Found !! Try Another Date", departDate : undefined });
        }
        else {
            console.log(res.body);
            response.render('bestfly', { id: "Travel by Air", temp, imageURL, flight: res.body.Quotes[0], carrier: res.body.Carriers[0], places: res.body.Places, errmsg: undefined, departDate : departDate });
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