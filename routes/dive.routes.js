/** @format */

const express = require("express");
const router = express.Router();

const Dive = require("../models/Dive.model");
const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

////////
// Routes
////////

router.get("/diving-sites", (req, res, next) => {
	Dive.find()
		.populate("user")
		.then((allDives) => {
			res.render("dives/dives-list", { allDives });
		})
		.catch((error) => {
			console.log("Error on getting the list of dives", error);
			next(error);
		});
});

router.get("/diving-sites/create", isLoggedIn, (req, res, next) => {
	res.render("dives/diving-sites-create");
});

router.post("/diving-sites/create", isLoggedIn, (req, res, next) => {
	const { divingSite, depth, duration, buddy, comments, placesToEat } =
		req.body;
	const newDive = {
		divingSite,
		depth,
		duration,
		buddy,
		comments,
		placesToEat,
		user: req.session.currentUser,
	};

	Dive.create(newDive)
		.then(() => {
			res.redirect("/diving-sites");
		})
		.catch((error) => {
			console.log("Error on creating a dive", error);
			next(error);
		});
});

module.exports = router;
