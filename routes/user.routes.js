/** @format */

const express = require("express");
const router = express.Router();

const Dive = require("../models/Dive.model");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");



router.get("/user-profile/:username", isLoggedIn, (req, res, next) => {
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

router.get("/:username/edit", isLoggedIn, (req, res, next) => {
  const { username } = req.params;	
  console.log(req.params)
  User.findOne({ username: username })
    .then((userDetails) => {
      res.render("users/user-details-edit", {
        userDetails,
        userIsLoggedIn: req.session.currentUser,
      });
    })
    .catch((error) => {
      console.log("Error finding user in the DB", error);
      next(error);
    });
});

router.post("/:username/edit", isLoggedIn, (req, res, next) => {
  const userName = req.params.username;
  console.log(req.params)
  //console.log(typeof userName)
  console.log(req.body)
  const { firstName, lastName, divingLevel, imgProfile } = req.body;
	
  User.findOneAndUpdate(
    { username: userName },
    { firstName, lastName, divingLevel, imgProfile },
    { new: true }
  )
    .then((userInfoUpdated) => {
      //console.log(userInfoUpdated);
      res.redirect(`/user/user-profile/${userInfoUpdated.username}`);
    })
    .catch((error) => {
      console.log("this is an error on update user information", error);
      next(error);
    });
});

module.exports = router;
