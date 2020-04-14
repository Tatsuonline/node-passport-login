const express = require("express"); // Calls in Express.
const expressLayouts = require("express-ejs-layouts"); // Calls in ejs for the layouts and views.
const MongoClient = require('mongodb').MongoClient // MongoDB client.
const mongoose = require("mongoose"); // Calls in mongoose for MongoDB.
const flash = require("connect-flash"); // For flash messages.
const session = require("express-session"); // Part of flash.
const passport = require("passport");

const app = express(); // Basic Express server.

// Passport Config
require("./config/passport")(passport);

// MongoDB Config
const dbName = 'jabil-ticket'
const url = 'mongodb://127.0.0.1:27017'
let db

mongoose.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)

  // Storing a reference to the database so you can use it later
  db = client.db(dbName)
  console.log(`Connected MongoDB: ${url}`)
  console.log(`Database: ${dbName}`)
})

// MongoDB Config
//const db = require("./config/keys").MongoURI;
// Connect to Mongo
//mongoose.connect(db, { useNewUrlParser: true })
//    .then(() => console.log("MongoDB is connected."))
//    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs"); // Sets ejs as the view engine.

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
  secret: 'Alex is the best.',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables For Flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use("/", require("./routes/index")); // Routes the index page.
app.use("/users", require("./routes/users")); // Routes the users pages (login and register).

const PORT = process.env.PORT || 5000; // Port where the app is run. The first option is if it gets deployed, the second option is if it is on the localhost.
app.listen(PORT, console.log(`Server started on port ${PORT}`)); // This starts the app. Back ticks are used instead of quotes so that a template string with a variable can be used.
