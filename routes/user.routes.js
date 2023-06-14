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

          res.render("users/user-profile", {
            userDivesArr,
            userIsLoggedIn
          });
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

router.get("/user-profile/:divetodoId/remove", isLoggedIn, (req, res, next) => {
  const { divetodoId } = req.params;
  const { username } = req.session.currentUser;

  User.findOne({ username: username })
    .populate("divesToDo")
    .then((userDetails) => {
      const diveToRemoveIndex = userDetails.divesToDo.findIndex(
        (elm) => elm._id.valueOf() === divetodoId
      );
      userDetails.divesToDo.splice(diveToRemoveIndex, 1);
      return User.findOneAndUpdate(
        { username: username },
        {divesToDo: userDetails.divesToDo})
    .then(() => {
        res.redirect(`/user/user-profile/${username}/dives-to-do`);
      });
    })
    .catch((error) => {
      console.log("Error finding user in DB", error);
      next(error);
    });
});

router.get(
  "/user-profile/:username/dives-to-do",
  isLoggedIn,
  (req, res, next) => {
    const username = req.session.currentUser.username;
    const diveOwner = req.params.username;
    let userIsLoggedIn = req.session.currentUser;
    let diveOwnerDetails = null;
    const removeToDo = true;

    if (username === diveOwner) {
      User.findOne({ username: username })
        .populate({
          path: "divesToDo",
          populate: {
            path: "user",
          },
        })
        .then((userDBIsLoggedIn) => {
          userIsLoggedIn = userDBIsLoggedIn;
          res.render("users/user-profile", {
            userIsLoggedIn,
            userDivesArr: userIsLoggedIn.divesToDo,
            removeToDo,
          });
        })
        .catch((error) => {
          console.log("Error finding user in DB", error);
          next(error);
        });
    } else {
      User.findOne({ username: diveOwner })
        .populate({
          path: "divesToDo",
          populate: {
            path: "user",
          },
        })
        .then((userDB) => {
          diveOwnerDetails = userDB;

          res.render("users/user-profile", {
            userIsLoggedIn,
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
