const express = require("express");
const router = express.Router();

const Dive = require("../models/Dive.model");
const User = require("../models/User.model");

router.get("/user-profile/:username", (req, res, next) => {
  const username = req.session.currentUser.username;
  let userIsLoggedIn = null;
  let userDivesArr = [];

  User.findOne({ username: username })
    .then((userDBIsLoggedIn) => {
      userIsLoggedIn = userDBIsLoggedIn;
      return Dive.find().populate("user");
    })
    .then((allDives) => {
      allDives.forEach((dive) => {
        if (dive.user.username === username) {
          userDivesArr.push(dive);
        }
      });

      res.render("users/user-profile", { userDivesArr, userIsLoggedIn });
    })
    .catch((error) => {
      console.log("Error finding user in DB", error);
      next(error);
    });
});

module.exports = router;
