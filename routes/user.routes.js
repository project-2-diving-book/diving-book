/** @format */

const express = require("express");
const router = express.Router();

const Dive = require("../models/Dive.model");
const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");

router.get(
	"/user-profile/:username",
	isLoggedIn,

	(req, res, next) => {
		const username = req.session.currentUser.username;
		const diveOwner = req.params.username;
		let userIsLoggedIn = req.session.currentUser;
		let diveOwnerDetails = null;
		let userDivesArr = [];
		if (username === diveOwner) {
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
		} else {
			User.findOne({ username: diveOwner })
				.then((userDB) => {
					diveOwnerDetails = userDB;

					return Dive.find().populate("user");
				})
				.then((allDives) => {
					allDives.forEach((dive) => {
						if (dive.user.username === diveOwner) {
							userDivesArr.push(dive);
						}
					});
					res.render("users/user-profile", {
						userDivesArr,
						userIsLoggedIn,
						diveOwnerDetails,
					});
				})
				.catch((error) => {
					console.log("Error finding user in DB", error);
					next(error);
				});
		}
	}
);

router.get("/:username/edit", isLoggedIn, (req, res, next) => {
	const { username } = req.params;
	console.log(req.params);
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
	const { firstName, lastName, email, divingLevel, username } = req.body;

	User.findOneAndUpdate(
		{ username: userName },
		{ firstName, lastName, email, divingLevel, username },
		{ new: true }
	)
		.then((userInfoUpdated) => {
			res.redirect(`/user-profile/${userInfoUpdated.username}`);
		})
		.catch((error) => {
			console.log("this is an error on update user information", error);
			next(error);
		});
});

module.exports = router;
