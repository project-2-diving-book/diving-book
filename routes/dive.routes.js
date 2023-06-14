/** @format */

const express = require("express");
const router = express.Router();

const Dive = require("../models/Dive.model");
const User = require("../models/User.model");

const fileUploader = require("../config/cloudinary.config");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const isUserThatCreatedDive = require("../middleware/isUserThatCreatedDive");

////////
// Routes
////////

///////////////   Displaying Diving Sites
router.get("/diving-sites/api", (req, res, next) => {
	Dive.find()
		.then((allDives) => {
			res.json(allDives);
		})
		.catch((error) => {
			console.log("Error on getting the list of dives", error);
			next(error);
		});
});

router.get("/diving-sites", (req, res, next) => {
	Dive.find()

		.then((allDives) => {
			// res.json(allDives);
			res.render("dives/dives-list", {
				allDives,
				userIsLoggedIn: req.session.currentUser,
			});
		})

		.catch((error) => {
			console.log("Error on getting the list of dives", error);
			next(error);
		});
});
///////////////   Displaying Diving Site Details

router.get("/diving-site-details/:id", (req, res, next) => {
	const { id } = req.params;

	Dive.findById(id)
		.populate("user")
		.then((diveDetails) => {
			res.render("dives/diving-site-details", {
				diveDetails,
				userIsLoggedIn: req.session.currentUser,
			});
		})
		.catch((error) => {
			console.log("Error finding the details for this dive", error);
			next(error);
		});
});

//////////////////  CREATE Diving Site

router.get("/diving-sites/create", isLoggedIn, (req, res, next) => {
	Dive.find().then((allDives) => {
		res.render("dives/diving-sites-create", {
			allDives: JSON.stringify(allDives),
			userIsLoggedIn: req.session.currentUser,
		});
	});
});

router.post(
	"/diving-sites/create",
	isLoggedIn,
	fileUploader.single("imgDive"),
	(req, res, next) => {
		const {
			divingSite,
			depth,
			duration,
			buddy,
			comments,
			placesToEat,
			imgDive,
			coords,
		} = req.body;

		let newDive = {
			divingSite,
			depth,
			duration,
			buddy,
			comments,
			placesToEat,
			coords,
			user: req.session.currentUser,
		};

		if (!req.file) {
			newDive.imgDive =
				"https://res.cloudinary.com/dcslof4ax/image/upload/v1686592088/user-folder/wxjsptzx8l5kplnay3wn.png";
		} else {
			newDive.imgDive = req.file.path;
		}

		Dive.create(newDive)
			.then(() => {
				res.redirect(`/user/user-profile/${req.session.currentUser.username}`);
			})
			.catch((error) => {
				console.log("Error on creating a dive", error);
				next(error);
			});
	}
);

////////////////////    Update Diving Site

router.get(
	"/diving-sites/:id/edit",
	isLoggedIn,
	isUserThatCreatedDive,
	/////////////////////////

	(req, res, next) => {
		const { id } = req.params;

		Dive.findById(id)
			.then((diveFromDB) => {
				res.render("dives/diving-site-edit", {
					diveFromDB,
					userIsLoggedIn: req.session.currentUser,
				});
			})
			.catch((error) => {
				console.log("this is an error on update of a dive ", error);
				next(error);
			});
	}
);

router.post(
	"/diving-sites/:id/edit",
	isLoggedIn,
	fileUploader.single("imgDive"),
	(req, res, next) => {
		const { id } = req.params;
		let { divingSite, depth, duration, buddy, comments, placesToEat, imgDive } =
			req.body;
		console.log(req.body);

		if (req.file) {
			imgDive = req.file.path;
		}

		Dive.findByIdAndUpdate(
			id,
			{
				divingSite,
				depth,
				duration,
				buddy,
				comments,
				placesToEat,
				imgDive,
			},
			{ new: true }
		)
			.populate("user")
			.then((diveUpdated) => {
				res.redirect(`/user/user-profile/${diveUpdated.user.username}`);
			})
			.catch((error) => {
				console.log(
					"this is an error on update of a dive and redirect ",
					error
				);
				next(error);
			});
	}
);

////////////////////    Delete Diving Site

router.post(
	"/diving-sites/:id/delete",
	isLoggedIn,
	isUserThatCreatedDive,
	(req, res, next) => {
		const { id } = req.params;

		Dive.findByIdAndDelete(id)
			.then(() => {
				res.redirect(`/user/user-profile/${req.session.currentUser.username}`);
			})
			.catch((error) => {
				console.log("Error deleting this dive", error);
				next(error);
			});
	}
);

router.post(
	"/diving-sites/:diveId/dive-to-do",
	isLoggedIn,
	(req, res, next) => {
		const { diveId } = req.params;
		const userEmail = req.session.currentUser.email;
		let diveToDo = {};

		Dive.findById(diveId)
			.then((diveFromDB) => {
				diveToDo = diveFromDB;
				//console.log(diveToDo)
				return User.findOne({ email: userEmail });
			})
			.then((userFromDB) => {
				//console.log(userFromDB)
				userFromDB.divesToDo.push(diveToDo);
				userFromDB.save();
				//console.log(userFromDB)
				res.redirect("/diving-sites");
			})
			.catch((error) => {
				console.log("Error finding user in DB", error);
				next(error);
			});
	}
);

module.exports = router;
