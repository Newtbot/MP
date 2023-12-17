const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config() 

const mysqlConfig = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
};

const mysqlConnection = mysql.createConnection(mysqlConfig);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_session_secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');

app.get('/login', (req, res) => {
  res.render('login');
});

// Check if the user is authenticated before accessing certain routes
function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Login route
app.post('/login', (req, res) => {
  let { username, password } = req.body;

  // Trim whitespace
  username = username.trim();

  // Validate username and password against MySQL
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  mysqlConnection.query(sql, [username, password], (error, results) => {
    if (error) {
      console.error('Error executing login query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('SQL Query:', sql, [username, password]);
    console.log('Query Results:', results);

    if (results.length === 0) {
      res.status(401).send('Invalid username or password');
    } else {
      // Set session data for authentication
      req.session.authenticated = true;
      req.session.username = username;

      // Redirect to the home page or any other protected route
      res.redirect('/home');
    }
  });
});

// Home route (protected by authentication)
app.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { username: req.session.username });
});

app.use(express.static('views'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


