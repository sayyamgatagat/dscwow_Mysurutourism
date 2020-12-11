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
    res.render('index', { temp, imageURL });
});

app.get('/destination', (req, res) => {
    getWeather();
    res.render('destination', { id: "Destination", temp, imageURL });
});

var places = {
    "mysuru": {
        "name": "Mysuru Palace", "info": "The Mysore Palace is a historical palace and the royal residence at Mysore in the Indian State of Karnataka. It is the official residence of the Wadiyar dynasty and the seat of the Kingdom of Mysore. The palace is in the centre of Mysore, and faces the Chamundi Hills eastward. Mysore is commonly described as the 'City of Palaces', and there are seven palaces including this one; however, 'Mysore Palace' refers specifically to this one within the Old fort. The land on which the palace now stands was originally known as puragiri (literally, citadel), and is now known as the Old Fort. Yaduraya built the first palace inside the Old Fort in the 14th century, which was demolished and constructed multiple times. The current structure was constructed between 1897 and 1912, after the Old Palace was burnt ablaze. Mysore Palace is now one of the most famous tourist attractions in India, after the Taj Mahal, with more than 6 million annual visitors.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.674321123399!2d76.65298621463789!3d12.305162991295514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf701103f9a1f9%3A0xc37fbae2a124da0d!2sMysore%20Palace!5e1!3m2!1sen!2sin!4v1607718078460!5m2!1sen!2sin"
    },

    "brindavan": {
        "name": "Brindavan Gardens", "info": "The Brindavan Gardens is a garden located in the Mandya District of the Indian State of Karnataka. It lies adjoining the Krishnarajasagara Dam which is built across the river Kaveri.[1] The work on laying out this garden was started in the year 1927 and completed in 1932.[2][3] Visited by close to 2 million tourists per year, the garden is one of the major attractions of Srirangapatna.[4] Sir Mirza Ismail, the Deewan of Mysore, a man with a penchant for gardens, founded the Brindavan Gardens (Krishnaraja Sagar Dam in particular) and built the Cauvery River high-level canal to irrigate 120,000 acres (490 km2) in modern Mandya district. He was inspired by Hyder Ali who had earlier built the Lalbagh Botanical Gardens at Bangalore.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3896.419951735979!2d76.57059751463912!3d12.421715591218256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf78e109feca5d%3A0x915fba7ee0e6b6b2!2sBrindavan%20Gardens!5e0!3m2!1sen!2sin!4v1607717897464!5m2!1sen!2sin"
    },

    "temple": {
        "name": "Shri Chamnudeshwari Temple", "info": "Sri Chamundeshwari Temple is about 13 kms from Mysuru, which is a prominent city in Karnataka State, India. Sri Chamundeshwari Temples is famous not only in India but also abroad. Atop of the hill the famous Sri Chamundeswari Temple. ‘Chamundi’ or ‘Durga’ is the fierce form of ‘Shakti’. She is the slayer of demons, ‘Chanda’ and ‘Munda’ and also ‘Mahishasura’, the buffalow-headed monster. She is the tutelary deity of the Mysuru Maharajas and the presiding deity of Mysuru. For several centuries they have held the Goddess, Chamundeswari, in great reverence. ‘Skanda Purana’ and other ancient texts mention a sacred place called ‘Trimuta Kshetra’ surrounded by eight hills. Lying on the western side is the Sri Chamundeshwari Temples, one among the eight hills. In the earlier days, the Hill was identified as ‘Mahabaladri’ in honour of God Shiva who resides in the ‘Mahabaleswara Temple’. This is the oldest temple on the hills. In the later days, the hill came to be known as ‘Sri Chamundeshwari Temples’ in honour of the Goddess Chamundi, the chief subject of the ‘Devi Mahathme’. The Goddess is believed to be an incarnation of Parvati, the consort of Lord Shiva. A large number of devotees from all over the country and from abroad visit the temple every year. They believe that the Goddess fulfills their desires and aspirations. Sri Chamundeshwari Temples rises to a height of 3,489 feet MSL and is visible from a distance itself while traveling towards Mysuru. There is a good motorable road to the top. Besides from Mysuru side, there is also a motorable road from its rear side, the Nanjangud side. Bus facilities are available to visit the hills. Karnataka State Road Transport Corporation (KSRTC) operates regular bus services every day for the convenience of pilgrims and others. A temple of great antiquity with over 1,000 years of background, it was a small shrine initially and assuming importance over the centuries it became a big temple as seen today. It assumed significance after the Mysuru Maharajas, the Wodeyars, came to power in 1399 A.D., great devotees and worshippers of the Devi, Chamundeswari became their home deity and thus assumed religious prominance.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.2382319036087!2d73.8070470147225!3d18.63320838734347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b845b3d20dfb%3A0x813caf1c1d9ccec8!2sShree%20Chamundeshwari%20Temple!5e1!3m2!1sen!2sin!4v1607717998397!5m2!1sen!2sin"
    },

    "zoo": {
        "name": "Sri Chamarajendra Zoological Gardens", "info": "Mysore Zoo was created from the private menagerie of Maharaja Sri Chamaraja Wodeyar in 1892, on 10 acres (4.0 ha) of the summer palace. Over the next 10 years the zoo was expanded to 45 acres (18 ha) with spacious enclosures that are still in use.[2] The Zoo's original founder, Sri Chamaraja Wodeyar Originally called the Palace Zoo, it was renamed \"Chamarajendra Zoological Gardens\" in 1909. Mr. A.C. Hughes, from South Wales, was the zoo's first superintendent. He served as the superintendent from 1892 to 1924. Hughes, Sir Mirza Ismail, and G.H. Krumbiegel worked towards refashioning the zoo and updating it with modern, natural enclosures. It now includes a bandstand and an artificial lake. It was given to the Department of Parks and Gardens of the Mysore State Government in 1948. The zoo was expanded first with another 50 acres (20 ha), and then another 150 acres (61 ha) with the acquisition of the Karanji Tank (Karanji reservoir), in which an artificial island has been created as a sanctuary for birds.[2] The zoo was handed over to the Forest Department in 1972, and was entrusted to Zoo Authority of Karnataka (the first autonomous organization in India to manage a zoo) in 1979.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.715575636642!2d76.66199951463778!3d12.302205691297546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7023040e7795%3A0xea57334ccb6cbfcb!2sSri%20Chamarajendra%20Zoological%20Gardens!5e1!3m2!1sen!2sin!4v1607718045204!5m2!1sen!2sin"
    },

    "cath": {
        "name": "St. Philomena's Cathedral", "info": "St. Philomena’s Cathedral is a Catholic church that is the cathedral of the Diocese of Mysore, India. The full name is the Cathedral of St. Joseph and St. Philomena. It is also known as St. Joseph's Cathedral.[3][4][5] It was constructed in 1936 using a Neo Gothic style and its architecture was inspired by the Cologne Cathedral in Germany.[6] This is one of the tallest churches in Asia. A church at the same location was built in 1843 by Maharaja Mummadi Krishnaraja Wodeyar. An inscription which was there at the time of laying the foundation of the present church in 1933 states: \"In the name of that only God - the universal Lord who creates, protects, and reigns over the universe of Light, the mundane world and the assemblage of all created lives - this church is built 1843 years after the incarnation of Jesus Christ, the Enlightenment of the World, as man\".",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.452645362807!2d76.656074814638!3d12.321041691285037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf706ecbc32f59%3A0x8e900b9cb740e32d!2sSt.%20Philomena&#39;s%20Cathedral!5e1!3m2!1sen!2sin!4v1607718138602!5m2!1sen!2sin"
    },

    "bonsai": {
        "name": "Kishkindha Moolika Bonsai Garden", "info": "Kishkinda Moolika Bonsai Garden is a famous garden located in Mysore, Karnataka. It is a part of the Avadhoota Datta Peetham founded by His Holiness Sri Ganapathi Sachchidananda Swamiji and is well-known for its numerous varieties of bonsai plants. It is a favorite spot for many nature lovers in the city and makes for a very good education trip to take with your kids. The bonsai garden was established in 1986 in Mysore by Swamiji as a part of the ashram. He saw bonsai as a mystic enterprise – “a rare human endeavor that has held me in awe and introspecting over years. In the miniature plant lives a grand life. It reflects the cosmic creation, the play of celestial paradoxes near, yet far, more, yet less, known, yet unknown, Small yet Big”. Though it started out as a small project, the garden quickly grew over the next decades, becoming a major attraction at the ashram. At present, it is spread over 4 acres.",
        "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.962003469606!2d76.65581201463769!3d12.284526091309207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf6fe4232c14bf%3A0xb60ece94f134f4ae!2sKishkindha%20Moolika%20Bonsai%20Garden!5e1!3m2!1sen!2sin!4v1607718193087!5m2!1sen!2sin"
    }
};

app.get('/places/:id', (req, res) => {
    // console.log('Params: ', req.params.id);
    getWeather();
    var id = req.params.id;
    console.log('Params: ', id, places[id]);
    res.render('places', { id, temp, imageURL, place: places[id] });
});

app.listen(3000, function () {
    console.log("app started at http://localhost:3000/")
});