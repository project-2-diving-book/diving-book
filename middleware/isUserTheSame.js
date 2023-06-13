/** @format */
const User = require("../models/User.model");

module.exports = (req, res, next) => {
	const { username } = req.session.currentUser;

	const diveUsername = req.params.username;

	if (username === diveUsername) {
		res.render(`user/user-profile/${username}`, { profileUser: true });
	} else {
		res.render(`user/user-profile/${diveUsername}`, { profileUser: false });
	}
};
