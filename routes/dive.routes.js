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

router.get("/diving-sites", (req, res, next) => {
  Dive.find()
    .populate("user")
    .then((allDives) => {
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
  res.render("dives/diving-sites-create", {
    userIsLoggedIn: req.session.currentUser,
  });
});

router.post(
  "/diving-sites/create",
  isLoggedIn,
  fileUploader.single("imgDive"),
  (req, res, next) => {
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
      imgDive: req.file.path,
    };

    Dive.create(newDive)
      .then(() => {
        res.redirect("/user-profile/:username");
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

router.post("/diving-sites/:id/edit", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const { divingSite, depth, duration, buddy, comments, placesToEat } =
    req.body;

  Dive.findByIdAndUpdate(
    id,
    { divingSite, depth, duration, buddy, comments, placesToEat },
    { new: true }
  )
    .populate("user")
    .then((diveUpdated) => {
      res.redirect(`/user-profile/${diveUpdated.user.username}`);
    })
    .catch((error) => {
      console.log("this is an error on update of a dive and redirect ", error);
      next(error);
    });
});

////////////////////    Delete Diving Site

router.post(
  "/diving-sites/:id/delete",
  isLoggedIn,
  isUserThatCreatedDive,
  (req, res, next) => {
    const { id } = req.params;

    Dive.findByIdAndDelete(id)
      .then(() => {
        res.redirect("/user-profile/:username");
      })
      .catch((error) => {
        console.log("Error deleting this dive", error);
        next(error);
      });
  }
);

module.exports = router;
