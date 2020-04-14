const express = require('express');
const router = express.Router(); // To use the express router.
const { ensureAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", (req, res) => res.render("welcome")); // This routes the index page and renders the welcome.ejs file using layout.ejs.
// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
	   res.render("dashboard", {
	       name: req.user.name
		     })); // This routes the dashboard.

module.exports = router;
