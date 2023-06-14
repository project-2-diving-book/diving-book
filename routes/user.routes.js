/** @format */

const express = require("express");
const router = express.Router();

const Dive = require("../models/Dive.model");
const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require("../config/cloudinary.config");

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
					console.log(userIsLoggedIn);
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

router.post(
	"/:username/edit",
	isLoggedIn,
	fileUploader.single("imgProfile"),
	(req, res, next) => {
		const userName = req.params.username;
		let { firstName, lastName, divingLevel, imgProfile } = req.body;

		if (req.file) {
			imgProfile = req.file.path;
		}
		User.findOneAndUpdate(
			{ username: userName },
			{ firstName, lastName, divingLevel, imgProfile },
			{ new: true }
		)
			.then((userInfoUpdated) => {
				res.redirect(`/user/user-profile/${userInfoUpdated.username}`);
			})
			.catch((error) => {
				console.log("this is an error on update user information", error);
				next(error);
			});
	}
);

router.get(
	"/user-profile/:username/dives-to-do",
	isLoggedIn,
	(req, res, next) => {
		// const { username } = req.params;

		// User.findOne({username: username})
		// 	.populate("divesToDo")
		// 	.then((userIsLoggedIn) => {
		// 		res.render("users/user-profile", { userIsLoggedIn })
		// 	})
		// 	.catch((error) => {
		// 		console.log("Error finding user in DB", error);
		// 		next(error);
		// 	})

		const username = req.session.currentUser.username;
		const diveOwner = req.params.username;
		let userIsLoggedIn = req.session.currentUser;
		let diveOwnerDetails = null;

		if (username === diveOwner) {
			User.findOne({ username: username })
				.populate("divesToDo")
				.then((userDBIsLoggedIn) => {
					userIsLoggedIn = userDBIsLoggedIn;
					console.log(userIsLoggedIn);

					res.render("users/user-profile", {
						userIsLoggedIn,
						userDivesArr: userIsLoggedIn.divesToDo,
					});
				})
				.catch((error) => {
					console.log("Error finding user in DB", error);
					next(error);
				});
		} else {
			User.findOne({ username: diveOwner })
				.populate("divesToDo")
				.then((userDB) => {
					diveOwnerDetails = userDB;
					console.log(diveOwnerDetails);

					res.render("users/user-profile", {
						diveOwnerDetails,
						userDivesArr: diveOwnerDetails.divesToDo,
					});
				})
				.catch((error) => {
					console.log("Error finding user in DB", error);
					next(error);
				});
		}
	}
);

module.exports = router;
