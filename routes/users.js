const express = require('express');
const router = express.Router(); // To use the express router.
const bcrypt = require("bcryptjs"); // To encrypt passwords.
const passport = require("passport"); // To use passport.

// User model
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => res.render("login")); // This routes the login page.

// Register Page
router.get("/register", (req, res) => res.render("register")); // This routes the register page.

// Register Handle
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields.
    if (!name || !email || !password || !password2) {
	errors.push({ msg: "Please fill in every field." });
    }

    // Check if the passwords match.
    if (password !== password2) {
	errors.push({ msg: "The passwords do not match." });
    }

    // Check the password length.
    if (password.length < 6) {
	errors.push({ msg: "Your password should be at least 6 characters." });
    }

    // Re-render if any errors.
    if (errors.length > 0) {
	res.render("register", {
	    errors,
	    name,
	    email,
	    password,
	    password2
	});
    } else {
	// Validation passed.

	User.findOne({ email: email }) // Use mongoose to find if it exists in the database.
	    .then(user => {
		if (user) {
		    // User exists.
		    errors.push({ msg: "This email address is already registered." });
		    res.render("register", {
			errors,
			name,
			email,
			password,
			password2
		    });
		} else {
		    const newUser = new User({
			name,
			email,
			password
		    });

		    // Hash the password.
		    bcrypt.genSalt(10, (error, salt) =>
				   bcrypt.hash(newUser.password, salt, (err, hash) => {
				       if (err) throw err;
				       // Set password to hashed password.
				       newUser.password = hash;
				       // Save the user.
				       newUser.save()
					   .then(user => {
					       req.flash("success_msg", "You are now registered and can log in.");
					       res.redirect("/users/login");
					   })
					   .catch(err => console.log(err));
				   }));
		    
		}
	    });
    }
});

// Login handling.
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
	successRedirect: "/dashboard",
	failureRedirect: "/users/login",
	failureFlash: true
    })(req, res, next);
});

// Logout handling.
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are now logged out.");
    res.redirect("/users/login");
});
module.exports = router;
