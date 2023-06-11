const express = require("express");
const router = express.Router();

const Dive = require("../models/Dive.model");
const User = require("../models/User.model");


router.get("/user-profile/:username", (req, res, next) => {
    const username = req.session.currentUser.username;

    User.findOne({username: username})
        .then((userIsLoggedIn) => {
            res.render("users/user-profile", { userIsLoggedIn })
        })
        .catch((error) => {
            console.log("Error finding user in DB", error);
            next(error);
        });
});



module.exports = router;
