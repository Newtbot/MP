const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Replace with your MySQL connection details
const mysqlConfig = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  timezone: 'Z', // Set the timezone to UTC
};

const mysqlConnection = mysql.createConnection(mysqlConfig);

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// InUsers route (renders the InUsers tab)
router.get('/', isAuthenticated, (req, res) => {
  // Fetch all user data from the database
  const userDataQuery = 'SELECT * FROM users';

  mysqlConnection.query(userDataQuery, (error, userData) => {
    if (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Render the inusers page with user data
    res.render('inusers', { userData: userData });
  });
});

// User Data route
router.get('/userdata', isAuthenticated, (req, res) => {
  // Fetch all user data from the database
  const userDataQuery = 'SELECT * FROM users';

  mysqlConnection.query(userDataQuery, (error, userData) => {
    if (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Render the user-data page with user data
    res.render('user-data', { userData: userData });
  });
});

// Edit User Data route
router.get('/edituserdata', isAuthenticated, (req, res) => {
  res.render('edit-user-data');
});

module.exports = router;
