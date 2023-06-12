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

router.get("/user/:userId/edit", isLoggedIn, (req, res, next) => {
	const { userId } = req.params;

	User.findById(userId)
		.then((userDetails) => {
			console.log(userDetails)
			res.render("users/user-details-edit", { userDetails, userIsLoggedIn: req.session.currentUser })
		})
		.catch((error) => {
			console.log("Error finding user in the DB", error);
			next(error);
		});
});

router.post("/user/:userId/edit", isLoggedIn, (req, res, next) => {
	const { userId } = req.params;
	const { firstName, lastName, email, divingLevel, username } = req.body;

	User.findByIdAndUpdate(userId, { firstName, lastName, email, divingLevel, username }, {new: true})
		.then((userInfoUpdated) => {
			res.render("users/user-details-edit", {userInfoUpdated})
		})
		.catch((error) => {
			console.log("this is an error on update user information", error);
			next(error);
		});
});

module.exports = router;
