const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

require('dotenv').config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req,res)=>{
    res.sendFile('index.html');
})





app.listen(3000,function(){
    console.log("app started at http://localhost:3000/")
});
