const Dive = require("../models/Dive.model");

module.exports = (req, res, next) => {
  const currentUserEmail = req.session.currentUser.email;
  const diveId = req.params.id;

  Dive.findById(diveId)
    .populate("user")
    .then((diveDetails) => {
      const diveUserEmail = diveDetails.user.email;
      if (currentUserEmail === diveUserEmail) {
        next();
      } else {
        return res
          .status(400)
          .render("dives/diving-site-details", {
            diveDetails,
            userIsLoggedIn: req.session.currentUser,
            errorMessage: "Only the user that created this dive can modify it",
          });
      }
    })
    .catch((error) => {
      console.log("Error finding dive by id in DB", error);
      next(error);
    });
};
