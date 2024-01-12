const express = require("express");
const session = require("express-session");
const mysql2 = require('mysql2');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');
const { body, validationResult } = require('express-validator');
const validator = require('validator');

const { transporter } = require("./modules/nodeMailer");
const { connection } = require("./modules/mysql"); 
const { connection2 } = require("./modules/mysql"); 
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.key,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false, // Make sure to set this to true in a production environment with HTTPS
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // Session duration in milliseconds (here set to 1 day)
		  },
	})
);

app.use((req, res, next) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }

    // Make the CSRF token available in the response context
    res.locals.csrfToken = req.session.csrfToken;
	console.log(`Server-side CSRF Token: ${req.session.csrfToken}`);
    next();
});

app.set("view engine", "ejs");

function isAuthenticated(req, res, next) {
	if (req.session && req.session.authenticated) {
		return next();
	} else {
		res.redirect("/login");
	}
}
const generateOTP = () => {
	const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
	const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
	return { otp, expirationTime };
  };

const sendOTPByEmail = async (email, otp) => {
	try {
	  const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: process.env.euser,  // replace with your email
		  pass: process.env.epass   // replace with your email password
		}
	  });
  
	  const mailOptions = {
		from: process.env.euser,
		to: email,
		subject: 'Login OTP',
		text: `Your OTP for login is: ${otp}`
	  };
  
	  await transporter.sendMail(mailOptions);
	  console.log('OTP sent successfully to', email);
	} catch (error) {
	  console.error('Error sending OTP:', error);
	  throw error;
	}
  };


app.get("/login", (req, res) => {
	
	res.render("login", { error: null });
});

const logActivity = async (username, success, message) => {
	try {
	  if (!username) {
		console.error("Error logging activity: Username is null or undefined");
		return;
	  }
  
	  const activity = success ? `successful login: ${message}` : `unsuccessful login: ${message}`;
	  const logSql =
		"INSERT INTO user_logs (username, activity, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)";
	  const logParams = [username, activity];
  
	  connection.query(logSql, logParams, (error, results) => {
		if (error) {
		  console.error("Error executing logSql:", error);
		  // Handle error (you may want to log it or take other appropriate actions)
		} else {
		  console.log("Activity logged successfully");
		}
	  });
	} catch (error) {
	  console.error("Error in logActivity function:", error);
	  // Handle error (you may want to log it or take other appropriate actions)
	}
  };
  
  const logLogoutActivity = async (username, success, message) => {
	try {
	  if (!username) {
		console.error("Error logging activity: Username is null or undefined");
		return;
	  }
  
	  const activity = success ? `successful logout: ${message}` : `unsuccessful logout: ${message}`;
	  const logSql =
		"INSERT INTO user_logs (username, activity, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)";
	  const logParams = [username, activity];
  
	  connection.query(logSql, logParams, (error, results) => {
		if (error) {
		  console.error("Error executing logSql:", error);
		  // Handle error (you may want to log it or take other appropriate actions)
		} else {
		  console.log("Activity logged successfully");
		}
	  });
	} catch (error) {
	  console.error("Error in logActivity function:", error);
	  // Handle error (you may want to log it or take other appropriate actions)
	}
  };
  
  app.post('/login', [
    body('username').escape().trim().isLength({ min: 1 }).withMessage('Username must not be empty'),
    body('password').escape().trim().isLength({ min: 1 }).withMessage('Password must not be empty'),
    body('csrf_token').escape().trim().isLength({ min: 1 }).withMessage('CSRF token must not be empty'),
],
async (req, res) => {
    try {
        const errors = validationResult(req);

        // Validate CSRF token
        if (req.body.csrf_token !== req.session.csrfToken) {
            return res.status(403).send("Invalid CSRF token");
        }

        if (!errors.isEmpty()) {
            // Handle validation errors, e.g., return an error message to the client
            return res.render('login', { error: 'Invalid input. Please check your credentials.', csrfToken: req.session.csrfToken });
        }

        let { username, password } = req.body;
        username = username.trim();

        const loginSql = "SELECT * FROM users WHERE username = ?";

        connection.query(loginSql, [username], async (error, results) => {
            if (error) {
                console.error("Error executing login query:", error);
                res.status(500).send("Internal Server Error");
                return;
            }

            if (results.length > 0) {
                const isLoginSuccessful = await bcrypt.compare(password, results[0].password);

                if (isLoginSuccessful) {
                    // Log successful login attempt
                    await logActivity(username, true, "Credentials entered correctly");

                    const user = results[0];
                    const { otp, expirationTime } = generateOTP();

                    // Store the OTP and expiration time in the session for verification
                    req.session.otp = otp;
                    req.session.otpExpiration = expirationTime;
                    req.session.save();

                    // Send OTP via email
                    try {
                        await sendOTPByEmail(user.email, otp);
                        // Log successful OTP sending
                        await logActivity(username, true, "OTP successfully sent to user");
                    } catch (sendOTPError) {
                        // Log unsuccessful OTP sending
                        await logActivity(username, false, "OTP failed to send to user");
                        console.error("Error sending OTP:", sendOTPError);
                        res.status(500).send("Internal Server Error");
                        return;
                    }

                    // Render OTP input page
                    res.render("otp", { error: null, username: user.username, csrfToken: req.session.csrfToken });
                } else {
                    // Log unsuccessful login attempt
                    await logActivity(username, false, "Incorrect password");
                    res.render("login", { error: "Invalid username or password", csrfToken: req.session.csrfToken });
                }
            } else {
                // Log unsuccessful login attempt
                await logActivity(username, false, "User not found");
                res.render("login", { error: "Invalid username or password", csrfToken: req.session.csrfToken });
            }
        });
    } catch (error) {
        console.error("Error in login route:", error);
        res.status(500).send("Internal Server Error");
    }
});

// OTP verification route
app.post("/verify-otp", [
    body('otp').escape().trim().isLength({ min: 1 }).withMessage('OTP must not be empty'),
    body('csrf_token').escape().trim().isLength({ min: 1 }).withMessage('CSRF token must not be empty'),
],
async (req, res) => {
    try {
        const errors = validationResult(req);

        // Validate CSRF token
        if (req.body.csrf_token !== req.session.csrfToken) {
            return res.status(403).send("Invalid CSRF token");
        }

        if (!errors.isEmpty()) {
            // Handle validation errors, e.g., return an error message to the client
            return res.render('otp', { error: 'Invalid OTP. Please try again.', username: req.body.username, csrfToken: req.session.csrfToken });
        }

        const enteredOTP = req.body.otp;

        if (enteredOTP === req.session.otp) {
            // Log successful OTP entry and login
            if (req.body.username) {
                await logActivity(req.body.username, true, "OTP entered correctly. Successful login");
            }

            // Correct OTP, generate a session token
            const sessionToken = crypto.randomBytes(32).toString('hex');

            // Store the session token in the session
            req.session.authenticated = true;
            req.session.username = req.body.username;
            req.session.sessionToken = sessionToken;
			res.locals.csrfToken = req.session.csrfToken;
	        console.log(`Server-side CSRF Token: ${req.session.csrfToken}`);
            console.log(`Generated Session Token: ${sessionToken}`);

            // Redirect to home page with session token
            res.redirect("/home");
        } else {
            // Log unsuccessful OTP entry
            if (req.body.username) {
                await logActivity(req.body.username, false, "Incorrect OTP entered");
            }

            // Incorrect OTP, render login page with error
            res.render("login", { error: "Incorrect OTP. Please try again.", csrfToken: req.session.csrfToken });
        }
    } catch (error) {
        console.error("Error in OTP verification route:", error);
        res.status(500).send("Internal Server Error");
    }
});
  
  app.get("/logout", (req, res) => {
	try {
		const username = req.session.username || "Unknown User";
	  // Log the user out by clearing the session
	  req.session.destroy(async (err) => {
		if (err) {
		  console.error("Error destroying session:", err);
		  await logLogoutActivity(username, false, "User logged out unsucessfully. Session not destroyed.");
		} else {
		  
		  console.log(`Session destroyed.`);
		  
		  // Log the logout activity using a separate async function
		  await logLogoutActivity(username, true, "User logged out. Session destroyed.");
		}
		// Redirect to the login page after logout
		res.redirect("/login");
	  });
	} catch (error) {
	  console.error("Error in logout route:", error);
	  res.status(500).send("Internal Server Error");
	}
  });
  

 
  
  

  app.get("/home", isAuthenticated, (req, res) => {
	
	// Retrieve the last 10 sensor data records from the sensordata table
	const sensorDataQuery =
	  "SELECT locationid, measurement, createdAt FROM sensordata ORDER BY createdAt DESC LIMIT 10";
  
	connection2.query(sensorDataQuery, (error, sensorDataResults) => {
	  if (error) {
		console.error("Error executing sensor data query:", error);
		res.status(500).send("Internal Server Error");
		return;
	  }
	  // Render the home page with sensor data
	  res.render("home", {
		username: req.session.username,
		sensorData: sensorDataResults,
	  });
	});
  });
 app.get('/api/locations', (req, res) => {
  connection2.query('SELECT `id`, `name` FROM `locations`', (error, results) => {
    if (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
  
app.get("/inusers", isAuthenticated, (req, res) => {
	// Fetch all user data from the database
	const allUsersQuery = "SELECT * FROM users";

	connection.query(allUsersQuery, (error, allUsers) => {
		if (error) {
			console.error("Error fetching all users:", error);
			res.status(500).send("Internal Server Error");
			return;
		}

		// Render the inusers page with JSON data
		res.render("inusers", { allUsers });
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

const logUserCreationActivity = async (creatorUsername, success, message) => {
	try {
		const activity = success
			? "successful user creation"
			: `unsuccessful user creation: ${message}`;
		const logSql =
			"INSERT INTO user_logs (username, activity, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)";
		const logParams = [creatorUsername, activity];

		connection.query(logSql, logParams, (error, results) => {
			if (error) {
				console.error("Error logging user creation activity:", error);
				// Handle error (you may want to log it or take other appropriate actions)
			} else {
				console.log("User creation activity logged successfully");
			}

		});
	} catch (error) {
		console.error("Error in logUserCreationActivity function:", error);
		// Handle error (you may want to log it or take other appropriate actions)
	}
};

app.post(
	'/createUser',
	[
	  body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty').escape(),
	  body('username').trim().isLength({ min: 1 }).withMessage('Username must not be empty').escape(),
	  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
	  body('password').custom((value) => {
		if (!isStrongPassword(value)) {
		  throw new Error('Password does not meet complexity requirements');
		}
		return true;
	  }),
	  body('jobTitle').trim().isLength({ min: 1 }).withMessage('Job title must not be empty').escape(),
	],
	async (req, res) => {
	  try {
		const errors = validationResult(req);
  
		if (!errors.isEmpty()) {
		  return res.status(400).json({ errors: errors.array() });
		}
  
		const { name, username, email, password, jobTitle } = req.body;
        console.log("Sanitized Input:", {
			name,
			username,
			email,
			password: "*****", // Avoid logging passwords
			jobTitle,
		  });
		// Extract the username of the user creating a new user
		const creatorUsername = req.session.username; // Adjust this based on how you store the creator's username in your session
  
		// Validate password complexity (additional check)
		if (!isStrongPassword(password)) {
		  return res
			.status(400)
			.json({ error: "Password does not meet complexity requirements" });
		}
  
		// Check if the username is already taken
		const checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
		connection.query(
		  checkUsernameQuery,
		  [username],
		  (usernameQueryErr, usernameResults) => {
			if (usernameQueryErr) {
			  console.error("Error checking username:", usernameQueryErr);
			  return res.status(500).json({ error: "Internal Server Error" });
			}
  
			if (usernameResults.length > 0) {
			  // Log unsuccessful user creation due to username taken
			  logUserCreationActivity(creatorUsername, false, "username taken");
			  return res
				.status(400)
				.json({
				  error: "Username is already taken",
				  message: "Username is already taken. Please choose a different username.",
				});
			}
  
			// Check if the email is already taken
			const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
			connection.query(
			  checkEmailQuery,
			  [email],
			  (emailQueryErr, emailResults) => {
				if (emailQueryErr) {
				  console.error("Error checking email:", emailQueryErr);
				  return res.status(500).json({ error: "Internal Server Error" });
				}
  
				if (emailResults.length > 0) {
				  // Log unsuccessful user creation due to email taken
				  logUserCreationActivity(creatorUsername, false, "email taken");
				  return res
					.status(400)
					.json({
					  error: "Email is already in use",
					  message: "Email is already in use. Please choose another email.",
					});
				}
  
				// Hash the password before storing it in the database
				bcrypt.hash(password, 10, (hashError, hashedPassword) => {
				  if (hashError) {
					console.error("Error hashing password:", hashError);
					return res.status(500).json({ error: "Internal Server Error" });
				  }
  
				  // Start a transaction
				  connection.beginTransaction((transactionErr) => {
					if (transactionErr) {
					  console.error("Error starting transaction:", transactionErr);
					  return res
						.status(500)
						.json({ error: "Internal Server Error" });
					}
  
					// Define the insert query
					const insertUserQuery =
					  "INSERT INTO users (name, username, email, password, lastLogin, jobTitle) VALUES (?, ?, ?, ?, NULL, ?)";
  
					// Log the query and its parameters
					console.log("Insert Query:", insertUserQuery);
					console.log("Query Parameters:", [
					  name,
					  username,
					  email,
					  hashedPassword,
					  jobTitle,
					]);
  
					// Execute the query with user data
					connection.query(
					  insertUserQuery,
					  [name, username, email, hashedPassword, jobTitle],
					  (queryErr, results) => {
						if (queryErr) {
						  console.error("Error executing query:", queryErr);
  
						  // Rollback the transaction in case of an error
						  connection.rollback((rollbackErr) => {
							if (rollbackErr) {
							  console.error(
								"Error rolling back transaction:",
								rollbackErr
							  );
							}
							// Log unsuccessful user creation due to an error
							logUserCreationActivity(
							  creatorUsername,
							  false,
							  "internal error"
							);
							return res
							  .status(500)
							  .json({ error: "Internal Server Error" });
						  });
						  return;
						}
  
						// Commit the transaction
						connection.commit((commitErr) => {
						  if (commitErr) {
							console.error(
							  "Error committing transaction:",
							  commitErr
							);
							// Log unsuccessful user creation due to an error
							logUserCreationActivity(
							  creatorUsername,
							  false,
							  "internal error"
							);
							return res
							  .status(500)
							  .json({ error: "Internal Server Error" });
						  }
  
						  // Log successful user creation
						  logUserCreationActivity(
							creatorUsername,
							true,
							"user created successfully"
						  );
  
						  // Log the results of the query
						  console.log("Query Results:", results);
  
						  // Respond with a success message
						  res
							.status(201)
							.json({ message: "User created successfully" });
						});
					  }
					);
				  });
				});
			  }
			);
		  }
		);
	  } catch (error) {
		console.error("Error creating user:", error);
		// Log unsuccessful user creation due to an error
		logUserCreationActivity(req.session.username, false, "internal error"); // Adjust this based on how you store the creator's username in your session
		res.status(500).json({ error: "Internal Server Error" });
	  }
	}
  );

app.get("/forgot-password", (req, res) => {
	res.render("forgot-password"); // Assuming you have an EJS template for this
});

app.get("/forgot-password", (req, res) => {
	res.render("forgot-password", { error: null, success: null });
});

// Handle the submission of the forgot password form
app.post("/forgot-password", (req, res) => {
	const { usernameOrEmail } = req.body;
  
	// Sanitize the input
	const sanitizedUsernameOrEmail = validator.escape(usernameOrEmail);
  
	// Perform the logic for sending the reset password email
  
	// Check if the username or email exists in the database
	const checkUserQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
	connection.query(
	  checkUserQuery,
	  [sanitizedUsernameOrEmail, sanitizedUsernameOrEmail],
	  (checkError, checkResults) => {
		if (checkError) {
		  console.error("Error checking user:", checkError);
		  const error = "An error occurred during the password reset process.";
		  res.render("forgot-password", { error, success: null });
		} else if (checkResults.length === 0) {
		  const error = "Username or email not found.";
		  res.render("forgot-password", { error, success: null });
		} else {
		  // Assuming the user exists, generate a reset token and send an email
		  const user = checkResults[0];
		  const resetToken = crypto.randomBytes(20).toString("hex");
		  const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour
  
		  // Update user with reset token and expiry
		  const updateQuery =
			"UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?";
		  connection.query(
			updateQuery,
			[resetToken, resetTokenExpiry, user.id],
			(updateError) => {
			  if (updateError) {
				console.error("Error updating reset token:", updateError);
				const error =
				  "An error occurred during the password reset process.";
				res.render("forgot-password", { error, success: null });
			  } else {
				// Send email with reset link
				const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
				const mailOptions = {
				  to: user.email,
				  subject: "Password Reset",
				  text: `Click on the following link to reset your password: ${resetLink}`,
				};
				transporter.sendMail(mailOptions, (emailError, info) => {
				  if (emailError) {
					console.error("Error sending email:", emailError);
					const error =
					  "An error occurred during the password reset process.";
					res.render("forgot-password", { error, success: null });
				  } else {
					console.log("Email sent: " + info.response);
					const success =
					  "Password reset email sent successfully. Check your inbox.";
					res.render("forgot-password", { error: null, success });
  
					// Log the successful sending of the reset link in the database
					logPasswordResetActivity(user.username,"link sent successfully");
				  }
				});
			  }
			}
		  );
		}
	  }
	);
  });

// Function to log the password reset activity in the database
function logPasswordResetActivity(username, activity) {
	const logSql =
		"INSERT INTO user_logs (username, activity, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)";
		connection.query(logSql, [username, activity], (error) => {
		if (error) {
			console.error("Error logging password reset activity:", error);
		} else {
			console.log("Password reset activity logged successfully");
		}
	});
}

// Handle Reset Password request
app.post("/reset-password/:token", async (req, res) => {
	const { token } = req.params;
	const { password, confirmPassword } = req.body;
  
	// Sanitize the inputs
	const sanitizedToken = validator.escape(token);
	const sanitizedPassword = validator.escape(password);
	const sanitizedConfirmPassword = validator.escape(confirmPassword);
  
	// Find user with matching reset token and not expired
	const selectQuery =
	  "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()";
	connection.query(selectQuery, [sanitizedToken], async (selectErr, selectResults) => {
	  if (selectErr) {
		console.error("Error querying reset token:", selectErr);
		return res.status(500).json({ error: "Error querying reset token" });
	  }
  
	  if (selectResults.length === 0) {
		// Pass the error to the template when rendering the reset-password page
		return res.render("reset-password", {
		  token,
		  resetError: "Invalid or expired reset token",
		});
	  }
  
	  // Check if passwords match
	  if (sanitizedPassword !== sanitizedConfirmPassword) {
		// Pass the error to the template when rendering the reset-password page
		return res.render("reset-password", {
		  token,
		  resetError: "Passwords do not match",
		});
	  }
  
	  // Check if the new password meets complexity requirements
	  if (!isStrongPassword(sanitizedPassword)) {
		// Pass the error to the template when rendering the reset-password page
		return res.render("reset-password", {
		  token,
		  resetError:
			"Password does not meet complexity requirements. It must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one symbol.",
		});
	  }
  
	  // Hash the new password
	  const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
  
	  // Update user's password and clear reset token
	  const updateQuery =
		"UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?";
	  connection.query(updateQuery, [hashedPassword, sanitizedToken], async (updateErr, updateResults) => {
		if (updateErr) {
		  console.error("Error updating password:", updateErr);
		  // Pass the error to the template when rendering the reset-password page
		  res.render("reset-password", {
			token,
			resetError: "Error updating password",
		  });
		} else {
		  // Log password reset activity
		  const username = selectResults[0].username; // Assuming 'username' is the column name
		  const logQuery = "INSERT INTO user_logs (username, activity, timestamp) VALUES (?, 'Password Reseted successfully', NOW())";
		  connection.query(logQuery, [username], (logErr) => {
			if (logErr) {
			  console.error("Error logging password reset:", logErr);
			  // You might want to handle the logging error here
			}
		  });
		  // Redirect to the success page upon successful password reset
		  res.redirect("/success");
		}
	  });
	});
  });

app.get("/success", (req, res) => {
	res.render("success");
});

app.get("/reset-password/:token", (req, res) => {
	const { token } = req.params;
	const error = req.query.error || null; // Get error from query parameter
	// Assuming you have this line in your server code where you render the reset-password view
	res.render("reset-password", {
		token,
		passwordValidationError: null,
		resetError: null,
		success: null,
	});
});
app.post("/reset-password", async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    const creatorUsername = req.session.username;

    // Sanitize the inputs
    const sanitizedUsername = validator.escape(username);
    const sanitizedPassword = validator.escape(password);
    const sanitizedConfirmPassword = validator.escape(confirmPassword);

    // Check if passwords match
    if (sanitizedPassword !== sanitizedConfirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the new password meets complexity requirements
    if (!isStrongPassword(sanitizedPassword)) {
        return res.status(400).json({
            error:
                "Password does not meet complexity requirements. It must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one symbol.",
        });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    // Check if the user exists in the database before updating the password
    const userExists = await checkIfUserExists(sanitizedUsername);

    if (!userExists) {
        return res.status(404).json({ error: "User does not exist" });
    }

    // Update user's password based on the username
    const updateQuery = "UPDATE users SET password = ? WHERE username = ?";
    connection.query(updateQuery, [hashedPassword, sanitizedUsername], async (updateErr, updateResults) => {
        if (updateErr) {
            console.error("Error updating password:", updateErr);
            return res.status(500).json({ error: "Error updating password" });
        }

        // Check if the update affected any rows
        if (updateResults.affectedRows > 0) {
            // Log password reset activity
            const logQuery = "INSERT INTO user_logs (username, activity, timestamp) VALUES (?, ?, NOW())";
            const logActivity = `Password has been reset for ${sanitizedUsername}`;
            connection.query(logQuery, [creatorUsername, logActivity], (logErr) => {
                if (logErr) {
                    console.error("Error logging password reset:", logErr);
                    // You might want to handle the logging error here
                }

                // Password update successful
                return res.status(200).json({ success: "Password updated successfully" });
            });
        } else {
            return res.status(404).json({
                error: "User not found or password not updated.",
            });
        }
    });
});

async function checkIfUserExists(username) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE username = ?";
        connection.query(query, [username], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length > 0);
            }
        });
    });
}
app.get('/searchUser', (req, res) => {
	const { username } = req.query;
  
	// Sanitize the input
	const sanitizedUsername = validator.escape(username);
  
	const query = 'SELECT * FROM users WHERE username = ?';
  
	connection.query(query, [sanitizedUsername], (err, results) => {
	  if (err) {
		console.error('MySQL query error:', err);
		res.status(500).json({ success: false, error: 'Internal Server Error' });
	  } else if (results.length === 0) {
		// No user found with the given username
		res.status(404).json({ success: false, error: 'User not found' });
	  } else {
		res.json(results);
	  }
	});
  });

app.get('/api/users', (req, res) => {
	const query = 'SELECT * FROM users';
  
	connection.query(query, (err, results) => {
	  if (err) {
		console.error('MySQL query error:', err);
		res.status(500).json({ success: false, error: 'Internal Server Error' });
	  } else {
		res.json(results);
	  }
	});
  });
  
  // Route to search for a user by username
  app.get('/api/searchUser', (req, res) => {
	const { username } = req.query;
	const query = 'SELECT * FROM users WHERE username = ?';
  
	connection.query(query, [username], (err, results) => {
	  if (err) {
		console.error('MySQL query error:', err);
		res.status(500).json({ success: false, error: 'Internal Server Error' });
	  } else {
		res.json(results);
	  }
	});
  });
  
  // Route to delete a user by username
  
  app.delete('/api/deleteUser/:username', async (req, res) => {
	const { username } = req.params;
	const query = 'DELETE FROM users WHERE username = ?';
	const creatorUsername = req.session.username;
	try {
	  // Log deletion activity to USER_LOGS
	  const deletionActivity = `User ${username} has been successfully deleted`;
	  const logQuery = 'INSERT INTO USER_LOGS (USERNAME, ACTIVITY, TIMESTAMP) VALUES (?, ?, CURRENT_TIMESTAMP)';
	  await executeQuery(logQuery, [creatorUsername, deletionActivity]);
  
	  // Perform user deletion
	  const results = await executeQuery(query, [username]);
  
	  if (results.affectedRows === 0) {
		res.status(404).json({ success: false, error: 'User not found' });
	  } else {
		res.json({ success: true, message: 'User deleted successfully' });
	  }
	} catch (error) {
	  console.error('MySQL query error:', error);
	  res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
	}
  });
  
  async function executeQuery(sql, values) {
	return new Promise((resolve, reject) => {
	  connection.query(sql, values, (err, results) => {
		if (err) {
		  reject(err);
		} else {
		  resolve(results);
		}
	  });
	});
  }
  
  app.get('/api/getLogs', (req, res) => {
	// Query the database to fetch logs
	const query = 'SELECT id, username, activity, timestamp FROM user_logs';
	connection.query(query, (err, results) => {
	  if (err) {
		console.error('Error fetching logs from MySQL:', err);
		res.status(500).json({ error: 'Error fetching logs from MySQL' });
		return;
	  }
  
	  // Format timestamps to a more readable format
	  const formattedLogs = results.map((log) => ({
		id: log.id,
		username: log.username,
		activity: log.activity,
		timestamp: new Date(log.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
	  }));
  
	  // Send the formatted logs as a JSON response
	  res.json(formattedLogs);
	});
  });
  

app.use(express.static("views"));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
