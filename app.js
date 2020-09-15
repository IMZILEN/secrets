require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))

/////////////// MONGOOSE //////////////////////////////////

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


/////////////// ENCRYPTION USING mongoose-encryption /////////////
userSchema.plugin(encrypt, { secret: process.env.SECKEY, encryptedFields: ["password"] });
/////////////// ENCRYPTION USING mongoose-encryption /////////////


const User = new mongoose.model("User", userSchema);
/////////////// END MONGOOSE //////////////////////////////


app.get("/", function(req, res) {
    res.render("home");
})

app.get("/register", function(req, res) {
    res.render("register")
})
app.post("/register", function(req, res) {
    let email = req.body.username;
    let password = req.body.password;
    const newUser = new User({
        email: email,
        password: password
    });
    newUser.save(function(err) {
        if (!err) {
            res.render("secrets")
        }
    });

})

app.get("/login", function(req, res) {
    res.render("login");
})
app.post("/login", function(req, res) {
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({email : email}, function(err, userFound) {
        if (!err) {
            if (userFound) {
                if (userFound.password === password) {
                    res.render("secrets");
                } else {
                    console.log("Your username or the password is incorrect. Please try again");
                }
            }
        }
    })
})

app.listen(3000, function() {
    console.log("Listening to port 3000 ...");
})