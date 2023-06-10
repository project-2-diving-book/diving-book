module.exports = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.currentUser) {
    return res.redirect("/auth/login");
  }
  //console.log(req.session.currentUser)
  //console.log(req.session.currentUser._id)
  next();
};