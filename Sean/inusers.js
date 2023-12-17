// inusers.js

const express = require('express');
const router = express.Router();

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
  res.render('inusers');
});

// User Data route
router.get('/userdata', isAuthenticated, (req, res) => {
  res.render('user-data');
});

// Edit User Data route
router.get('/edituserdata', isAuthenticated, (req, res) => {
  res.render('edit-user-data');
});

module.exports = router;
