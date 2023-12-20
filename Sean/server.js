const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const mysqlConfig = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  timezone: 'Z', // Set the timezone to UTC
};

const mysqlConnection = mysql.createConnection(mysqlConfig);
mysqlConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587, // use the appropriate port for your SMTP server
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.euser,
    pass: process.env.epass
  },
});
console.log(process.env.euser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_session_secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
}

app.get('/login', (req, res) => {
  // Pass an initial value for the error variable
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username.trim();

    const loginSql = 'SELECT * FROM users WHERE username = ?';
    const updateLastLoginSql = 'UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE username = ?';

    // Check credentials and retrieve user information
    const connection = mysql.createConnection(mysqlConfig);

    connection.connect();

    console.log('Login Query:', loginSql);
    console.log('Query Parameters:', [username]);

    connection.query(loginSql, [username], async (error, results) => {
      console.log('Login Results:', results);

      if (error) {
        console.error('Error executing login query:', error);
        res.status(500).send('Internal Server Error');
        connection.end(); // Close the connection in case of an error
        return;
      }

      if (results.length === 0) {
        // Pass the error to the template
        res.render('login', { error: 'Invalid username or password' });
        connection.end(); // Close the connection when not needed anymore
      } else {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          // Update lastLogin field for the user
          connection.query(updateLastLoginSql, [username], (updateError, updateResults) => {
            if (updateError) {
              console.error('Error updating lastLogin:', updateError);
              res.status(500).send('Internal Server Error');
              connection.end(); // Close the connection in case of an error
              return;
            }

            // Check if the update affected any rows
            if (updateResults.affectedRows > 0) {
              // Set session data for authentication
              req.session.regenerate(err => {
                if (err) {
                  console.error('Error regenerating session:', err);
                }
                console.log('Session regenerated successfully');
                req.session.authenticated = true;
                req.session.username = username;
                res.redirect('/home');
                connection.end();
              });
            } else {
              // Pass the error to the template
              res.render('login', { error: 'Error updating lastLogin. No rows affected.' });
              connection.end(); // Close the connection when not needed anymore
            }
          });
        } else {
          // Pass the error to the template
          res.render('login', { error: 'Invalid username or password' });
          connection.end(); // Close the connection when not needed anymore
        }
      }
    });
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Update your /home route to retrieve the overall last 10 logins for all users
app.get('/home', isAuthenticated, (req, res) => {
  // Retrieve the overall last 10 logins for all users
  const loginsQuery = 'SELECT username, lastLogin FROM users ORDER BY lastLogin DESC LIMIT 10';

  mysqlConnection.query(loginsQuery, (error, loginResults) => {
    if (error) {
      console.error('Error executing login logs query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Log the results on the server side
    console.log('Login Logs on Server:', loginResults);

    // Render the home page with login logs data
    res.render('home', { username: req.session.username, loginLogs: loginResults });
  });
});
app.get('/inusers', isAuthenticated, (req, res) => {
  // Fetch all user data from the database
  const allUsersQuery = 'SELECT * FROM users';

  mysqlConnection.query(allUsersQuery, (error, allUsers) => {
    if (error) {
      console.error('Error fetching all users:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Render the inusers page with JSON data
    res.render('inusers', { allUsers });
  });
});
function isStrongPassword(password) {
  // Password must be at least 10 characters long
  if (password.length < 10) {
    return false;
  }

  // Password must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Password must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Password must contain at least one digit
  if (!/\d/.test(password)) {
    return false;
  }

  // Password must contain at least one symbol
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }

  return true;
} 

app.post('/createUser', (req, res) => {
  try {
    const { name, username, email, password, jobTitle } = req.body;

    // Validate password complexity
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Password does not meet complexity requirements' });
    }

    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        console.error('Error hashing password:', hashError);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Start a transaction
      mysqlConnection.beginTransaction((transactionErr) => {
        if (transactionErr) {
          console.error('Error starting transaction:', transactionErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Define the insert query
        const insertUserQuery = 'INSERT INTO users (name, username, email, password, lastLogin, jobTitle) VALUES (?, ?, ?, ?, NULL, ?)';

        // Log the query and its parameters
        console.log('Insert Query:', insertUserQuery);
        console.log('Query Parameters:', [name, username, email, hashedPassword, jobTitle]);

        // Execute the query with user data
        mysqlConnection.query(insertUserQuery, [name, username, email, hashedPassword, jobTitle], (queryErr, results) => {
          if (queryErr) {
            console.error('Error executing query:', queryErr);

            // Rollback the transaction in case of an error
            mysqlConnection.rollback((rollbackErr) => {
              if (rollbackErr) {
                console.error('Error rolling back transaction:', rollbackErr);
              }
              res.status(500).json({ error: 'Internal Server Error' });
            });
            return;
          }

          // Commit the transaction
          mysqlConnection.commit((commitErr) => {
            if (commitErr) {
              console.error('Error committing transaction:', commitErr);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

            // Log the results of the query
            console.log('Query Results:', results);

            // Respond with a success message
            res.status(201).json({ message: 'User created successfully' });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password'); // Assuming you have an EJS template for this
});

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { error: null, success: null });
});

// Handle the submission of the forgot password form
app.post('/forgot-password', (req, res) => {
  const { usernameOrEmail } = req.body;

  // Perform the logic for sending the reset password email
  // This is a simplified example, you should implement your own logic here

  // Check if the username or email exists in the database
  const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  mysqlConnection.query(checkUserQuery, [usernameOrEmail, usernameOrEmail], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking user:', checkError);
      const error = 'An error occurred during the password reset process.';
      res.render('forgot-password', { error, success: null });
    } else if (checkResults.length === 0) {
      const error = 'Username or email not found.';
      res.render('forgot-password', { error, success: null });
    } else {
      // Assuming the user exists, generate a reset token and send an email
      const user = checkResults[0];
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

      // Update user with reset token and expiry
      const updateQuery = 'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?';
      mysqlConnection.query(updateQuery, [resetToken, resetTokenExpiry, user.id], (updateError) => {
        if (updateError) {
          console.error('Error updating reset token:', updateError);
          const error = 'An error occurred during the password reset process.';
          res.render('forgot-password', { error, success: null });
        } else {
          // Send email with reset link
          const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
          const mailOptions = {
            to: user.email,
            subject: 'Password Reset',
            text: `Click on the following link to reset your password: ${resetLink}`,
          };

          transporter.sendMail(mailOptions, (emailError, info) => {
            if (emailError) {
              console.error('Error sending email:', emailError);
              const error = 'An error occurred during the password reset process.';
              res.render('forgot-password', { error, success: null });
            } else {
              console.log('Email sent: ' + info.response);
              const success = 'Password reset email sent successfully. Check your inbox.';
              res.render('forgot-password', { error: null, success });
            }
          });
        }
      });
    }
  });
});
// Handle Reset Password request
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Find user with matching reset token and not expired
  const selectQuery = 'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()';
  mysqlConnection.query(selectQuery, [token], async (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error querying reset token:', selectErr);
      return res.status(500).json({ error: 'Error querying reset token' });
    }

    if (selectResults.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.render('reset-password', { token, error: 'Passwords do not match' });
    }

    // Check if the new password meets complexity requirements
    if (!isStrongPassword(password)) {
      return res.render('reset-password', { token, error: 'Password does not meet complexity requirements. It must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one symbol.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token
    const updateQuery = 'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?';
    mysqlConnection.query(updateQuery, [hashedPassword, token], (updateErr) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        res.status(500).json({ error: 'Error updating password' });
      } else {
        res.render('reset-password', { error: null, success: 'Password changed successfully', token });
      }
    });
  });
});

app.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const error = req.query.error || null; // Get error from query parameter
  res.render('reset-password', { token, error: null, success: null });
});

app.use(express.static('views'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
