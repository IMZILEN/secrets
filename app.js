require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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


const User = new mongoose.model("User", userSchema);
/////////////// END MONGOOSE //////////////////////////////


app.get("/", function(req, res) {
    res.render("home");
})

app.get("/register", function(req, res) {
    res.render("register")
})
app.post("/register", function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (!err) {
            let email = req.body.username;
            let password = hash;
            const newUser = new User({
                email: email,
                password: password
            });
            newUser.save(function(err) {
                if (!err) {
                    res.render("secrets")
                }
            });
        } else {
            console.log(err);
        }
    });

})

app.get("/login", function(req, res) {
    res.render("login");
})
app.post("/login", function(req, res) {
    const email = req.body.username;
    User.findOne({email : email}, function(err, userFound) {
        if (!err) {
            if (userFound) {
                bcrypt.compare(req.body.password, userFound.password, function(err, result) {
                    if (!err) {
                        if (result == true) {
                            res.render("secrets")
                        } else {
                            console.log("Your password is incorrect. Please try again")
                        }
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log("Your email/username is incorrect. Please try again")
            }
        }
    })

})

app.listen(3000, function() {
    console.log("Listening to port 3000 ...");
})