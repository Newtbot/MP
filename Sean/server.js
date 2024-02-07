const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require('validator');
const axios = require('axios');
const pidusage = require('pidusage');
const path = require('path');

const { validationResult } = require('express-validator');
const { locationValidation, locationValidationUpdate, locationdeleteValidation
,sensorValidation, sensorupdateValidation, sensordeleteValidation, loginValidation
,otpValidation, createValidation } = require('./modules/validationMiddleware');
const rateLimit = require('./modules/rateLimitMiddleware');
const { generateOTP, sendOTPByEmail } = require('./modules/otpUtils');
const { format } = require('date-fns');
const { Sequelize } = require('sequelize');
const { transporter } = require("./modules/nodeMailer");
const { sequelize, User } = require("./modules/mysql");
const userLogs= require('./models/userLogs')(sequelize); 
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(session({
    secret: process.env.key,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Make sure to set this to true in a production environment with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // Session duration in milliseconds (here set to 1 day)
    },
}));
function isAuthenticated(req, res, next) {
	if (req.session && req.session.authenticated) {
		return next();
	} else {
		res.redirect("/index");
	}
}
router.get(["/", "/index"], function (req, res) {
	res.render("index");
}); 


app.get("/login", (req, res) => {
	res.render("login", { error: null });
});

app.use('/login', rateLimit);
  
app.post('/login', loginValidation, async (req, res) => {
  try {const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { error: 'Invalid input. Please check your credentials.', csrfToken: req.session.csrfToken });
    }
    let { username, password } = req.body;
    username = username.trim();
    const user = await User.findOne({ where: { username } });
    if (user) {
      const isLoginSuccessful = await bcrypt.compare(password, user.password);

      if (isLoginSuccessful) {
		await userLogs.create({ username, success: true, activity: "Credentials entered correctly" });

        const { otp, expirationTime } = generateOTP();

		await user.update({
			otp,
			otp_expiration_time: expirationTime,
		  });

        try {
          await sendOTPByEmail(user.email, otp);
		  await userLogs.create({
			username: username,
			activity: "OTP successfully sent to user",
		  });
          
        } catch (sendOTPError) {
			await userLogs.create({
				username: username,
				activity: "OTP failed to send to user",
			  });
          
          console.error("Error sending OTP:", sendOTPError);
          return res.status(500).send("Internal Server Error");
        }

        res.render("otp", { error: null, username: user.username, csrfToken: req.session.csrfToken });
      } else {
        await userLogs.create({ username, success: false, activity: "Incorrect password" });

        res.render("login", { error: "Invalid username or password", csrfToken: req.session.csrfToken });
      }
    } else {
      await userLogs.create({
        username: username,
       activity: "User not found",
      });

      res.render("login", { error: "Invalid username or password", csrfToken: req.session.csrfToken });
    }
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function clearSession(username) {
	await User.update({ sessionid: null }, { where: { username } });
	res.redirect('/index');
  }

// OTP verification route
app.post("/verify-otp", otpValidation ,async (req, res) => {
	try {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.render('otp', { error: 'Invalid OTP. Please try again.'});
	  }
	  const enteredOTP = req.body.otp;
  
	  if (!req.session) {
		console.error("Session is not defined.");
		return res.status(500).send("Internal Server Error");
	  }
  
	  const user = await User.findOne({ where: { username: req.body.username } });
  
	  if (!user) {
		console.error("User not found.");
		return res.status(500).send("Internal Server Error");
	  }
  
	  const storedOTP = user.otp;
      const expirationTime = user.otp_expiration_time;

	  if (enteredOTP === storedOTP && new Date() < new Date(expirationTime)) {
		if (req.body.username) {
		  await userLogs.create({ username: req.body.username, activity: "OTP entered correctly" });
		}
		await user.update({
			otp: null,
			otp_expiration_time: null,
		  });
  
		const sessionToken = crypto.randomBytes(32).toString('hex');
		const username = req.body.username; // Replace with the actual username

		User.update({ sessionid: sessionToken }, { where: { username } })
		.then(([rowsUpdated]) => {
		  if (rowsUpdated > 0) {
			console.log(`SessionId updated for user: ${username}`);
			setTimeout(async () => {
				await clearSession(username);
				console.log(`Session for user ${username} cleared after expiration.`);
			  }, 9 * 60 * 60 * 1000);
		  } else {
			console.error('User not found.');
		  }
		})
		.catch(error => {
		  console.error('Error updating sessionId:', error);
		});
		const jobTitle = user ? user.jobTitle : null;

		// console.log(jobTitle);
		req.session.jobTitle = jobTitle;
		// console.log(req.session.jobTitle);
		req.session.authenticated = true;
		req.session.username = req.body.username;
		req.session.sessionToken = sessionToken;
		req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  
		res.cookie('sessionToken', sessionToken, { secure: true, httpOnly: true, expires: new Date(Date.now() + 9 * 60 * 60 * 1000) }); // Expires in 9 hours

  
		res.redirect("/home");
	  } else {
		if (req.body.username) {
		  await userLogs.create({ username: req.body.username, activity: "Incorrect OTP entered" });
		}
  
		res.render("login", { error: "Incorrect OTP. Please try again."});
	  }
	} catch (error) {
	  console.error("Error in OTP verification route:", error);
	  res.status(500).send("Internal Server Error");
	}
  });
  
  app.get("/logout", async (req, res) => {
	try {
	  const username = req.session.username ;
	    // Log the logout activity using Sequelize
	await User.update({ sessionid: null }, { where: { username } })
	await userLogs.create({ username, activity: "User logging out." });
	  // Log the user out by clearing the session
	  req.session.destroy(async (err) => {
		if (err) {
		  console.error("Error destroying session:", err);
  
		  // Log the logout activity using Sequelize
		  await userLogs.create({ username, activity: "User logged out unsuccessfully. Session not destroyed." });
		} else {
		  console.log("Session destroyed.");
		  res.clearCookie('sessionToken');
		}
  
		// Redirect to the login page after logout
		res.redirect("/index");
	  });
	} catch (error) {
	  console.error("Error in logout route:", error);
	  res.status(500).send("Internal Server Error");
	}
  });

  const getDatabaseStatus = async () => {
	try {
	  await sequelize.authenticate();
	  return { connected: true };
	} catch (error) {
	  console.error('Database connection error:', error);
	  return { connected: false, error: error.message };
	}
  };
  
  const getSystemHealth = async () => {
	const cpuInfo = await pidusage(process.pid);
	const databaseStatus = await getDatabaseStatus();
	return {
	  serverStatus: { uptime: process.uptime() },
	  databaseStatus,
	  resourceUtilization: {
		cpuUsage: cpuInfo.cpu,
		memoryUsage: process.memoryUsage(),
	  },
	};
  };
  app.get("/home", isAuthenticated, async (req, res) => {
	const systemHealth = await getSystemHealth();
	const sessionTokencookie = req.cookies['sessionToken'];

			if (!sessionTokencookie) {
				// Redirect the user to the /home page
				return res.redirect('/index');}
	  res.render("home", { username: req.session.username, systemHealth});
	});

	app.get("/inusers", isAuthenticated, async (req, res) => {
		const sessionTokencookie = req.cookies['sessionToken'];

			if (!sessionTokencookie) {
				// Redirect the user to the /home page
				return res.redirect('/index');}
		try {
			// Fetch all user data from the database using Sequelize
			const allUsers = await User.findAll({
				attributes: ['name', 'username', 'email', 'jobTitle'],
			  });
	
			const currentUsername = req.session.username;
			// Render the inusers page with JSON data
			res.render("inusers", {allUsers, csrfToken: req.session.csrfToken, currentUsername });
		} catch (error) {
			console.error("Error fetching all users:", error);
			res.status(500).send("Internal Server Error");
		}
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

app.post
	('/createUser', createValidation,
  async (req, res) => {
        try {
			const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
			const sessionTokencookie = req.cookies['sessionToken'];

			
            // Verify sessionToken with the one stored in the database
            const user = await User.findOne({ where: { sessionid: sessionTokencookie } });

            if (!user) {
                return res.status(403).json({ error: 'Invalid sessionToken' });
            }
            // Validate the anti-CSRF token
            const submittedCSRFToken = req.body.csrf_token;
			
            if (!req.session.csrfToken || submittedCSRFToken !== req.session.csrfToken) {
                return res.status(403).json({ error: 'CSRF token mismatch' });
            }

            // Extract user input
            const { name, username, email, password, jobTitle } = req.body;
            console.log(submittedCSRFToken);

            // Extract the username of the user creating a new user
            const creatorUsername = req.session.username; // Adjust this based on how you store the creator's username in your session


            // Check if the username is already taken
            const existingUser = await User.findOne({ where: { username } });

            if (existingUser) {
                // Log unsuccessful user creation due to username taken
                await userLogs.create({ username: creatorUsername, activity: "username taken" });

                return res.status(400).json({
                    error: "Username is already taken",
                    message: "Username is already taken. Please choose a different username."
                });
            }

            // Check if the email is already taken
            const existingEmailUser = await User.findOne({ where: { email } });

            if (existingEmailUser) {
                // Log unsuccessful user creation due to email taken
                await userLogs.create({ username: creatorUsername, activity: "email taken" });

                return res.status(400).json({
                    error: "Email is already in use",
                    message: "Email is already in use. Please choose another email."
                });
            }

            // Hash the password
			const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Start a transaction
            const t = await sequelize.transaction();

            try {
                // Create the user
                await User.create({
                    name,
                    username,
                    email,
                    password: hashedPassword,
                    lastLogin: null,
                    jobTitle,
                }, { transaction: t });

                // Commit the transaction
                await t.commit();

                // Log successful user creation
                await userLogs.create({ username: creatorUsername, activity: "user created successfully" });

                return res.status(200).json({ message: "User created successfully" });
            } catch (createUserError) {
                // Rollback the transaction in case of an error
                await t.rollback();

                console.error("Error creating user:", createUserError);

                // Log unsuccessful user creation due to an error
                await userLogs.create({ username: creatorUsername, activity: "internal error" });

                return res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
);


app.get("/forgot-password", (req, res) => {
	res.render("forgot-password", { error: null, success: null });
});

app.post("/forgot-password", async (req, res) => {
	let user; // Declare the 'user' variable outside the try-catch block
  
	try {
	  const { usernameOrEmail } = req.body;
  
	  // Sanitize the input
	  const sanitizedUsernameOrEmail = validator.escape(usernameOrEmail);
  
	  // Find the user by username or email
	  user = await User.findOne({
		where: {
		  [Sequelize.Op.or]: [
			{ username: sanitizedUsernameOrEmail },
			{ email: sanitizedUsernameOrEmail },
		  ],
		},
	  });
  
	  if (!user) {
		const error = "Username or email not found.";
		return res.render("forgot-password", { error, success: null });
	  }
	  // Generate reset token and update the user
	  const reset_token = crypto.randomBytes(20).toString("hex");
	  const reset_token_expiry = new Date(Date.now() + 600000); // 600000 milliseconds = 10 minutes
	  // Update the user with the reset token and expiry
	  await User.update({reset_token,reset_token_expiry,},
		{where: {id: user.id},}
	  );
	  // Send email with reset link
	  const resetLink = `http://localhost:3000/reset-password/${reset_token}`;
	  const mailOptions = {
		to: user.email,
		subject: "Password Reset",
		text: `Click on the following link to reset your password: ${resetLink}`,
	  };
	  await transporter.sendMail(mailOptions);
	  const success = "Password reset email sent successfully. Check your inbox.";
	  res.render("forgot-password", { error: null, success });
	  // Log the successful sending of the reset link in the database
	  await userLogs.create({
		username: user.username,
		activity: "Password reset link sent successfully",
	  });
	} catch (error) {
	  if (user) {
		await userLogs.create({
		  username: user.username,
		  activity: "Password reset link unsuccessfully sent. Please check with the administrator.",
		});
	  }
	  console.error("Error during password reset:", error);
	  const errorMessage = "An error occurred during the password reset process.";
	  res.render("forgot-password", { error: errorMessage, success: null });
	}});
  
  app.post("/reset-password/:token", async (req, res) => {
	try {
	  const { token } = req.params;
	  const { password, confirmPassword } = req.body;
	  // Sanitize the inputs
	  const sanitizedToken = validator.escape(token);
	  const sanitizedPassword = validator.escape(password);
	  const sanitizedConfirmPassword = validator.escape(confirmPassword);
	  // Find user with matching reset token and not expired
	  const user = await User.findOne({
		where: {reset_token: sanitizedToken,
		reset_token_expiry: { [Sequelize.Op.gt]: new Date() },
		},
	  });
	  if (!user) {
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
		  token, resetError:
			"Password does not meet complexity requirements. It must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one symbol.",
		});
	  }
	  // Hash the new password 
	  const saltRounds = 10;
	  const hashedPassword = await bcrypt.hash(sanitizedPassword, saltRounds);
	  // Update user's password and clear reset token
	  const updateQuery = {
		password: hashedPassword,
		reset_token: null,
		reset_token_expiry: null,
	  };
	  const whereCondition = {reset_token: sanitizedToken,};
	  await User.update(updateQuery, {
		where: whereCondition,
	  });
	  // Log password reset activity
	  await userLogs.create({
		username: user.username,
		activity: "Password reset successfully",
	  });
  
	  // Redirect to the success page upon successful password reset
	  res.redirect("/success");
	} catch (error) {
	  console.error("Error during password reset:", error);
	  // Pass the error to the template when rendering the reset-password page
	  res.render("reset-password", {
		token: req.params.token,
		resetError: "Error during password reset",
	  });
	}
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
    const { username, password, confirmPassword, csrf_token } = req.body;
    const creatorUsername = req.session.username;
    const submittedCSRFToken = req.body.csrf_token;

    if (!req.session.csrfToken || submittedCSRFToken !== req.session.csrfToken) {
        return res.status(403).json({ error: 'CSRF token mismatch' });
    }
	const sessionTokencookie = req.cookies['sessionToken'];
     
    // Verify sessionToken with the one stored in the database
    const user = await User.findOne({ where: { sessionid: sessionTokencookie } });
            if (!user) {
                return res.status(403).json({ error: 'Invalid sessionToken' });
            }
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
    try {
        // Find the user in the database
        const user = await User.findOne({ where: { username: sanitizedUsername } });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }
        // Generate a random salt and hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(sanitizedPassword, saltRounds);
        // Update user's password
        await User.update(
			{ password: hashedPassword },
			{ where: { username: sanitizedUsername } }
		);
        // Log password reset activity
        await userLogs.create({
            username: creatorUsername,
            activity: `Password has been reset for ${sanitizedUsername}`,
        });
        // Password update successful
        return res.status(200).json({ success: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ error: "Error updating password" });
    }
});

  
app.get('/api/searchUser', async (req, res) => {
	
    const { username } = req.query;
    try {
        // Find the user in the database by username
        const user = await User.findOne({ where: { username } });

        if (!user) {
            // No user found with the given username
            res.status(404).json({ success: false, error: 'User not found' });
        } else {
            // User found, return user data
            res.json(user);

		        }
    } catch (error) {
        console.error('Sequelize query error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
  
app.delete('/api/deleteUser/:username', async (req, res) => {
	
    const { username } = req.params;
    const creatorUsername = req.session.username;
	
	try {
        
        // Retrieve CSRF token from the request body
        const { csrfToken } = req.body;
        
        // Compare CSRF token with the one stored in the session
        if (csrfToken !== req.session.csrfToken) {
            return res.status(403).json({ success: false, error: 'CSRF token mismatch' });
		}
		const sessionTokencookie = req.cookies['sessionToken'];
		
        // Verify sessionToken with the one stored in the database
        const user = await User.findOne({ where: { sessionid: sessionTokencookie} });

        if (!user) {
            return res.status(403).json({ success: false, error: 'Invalid sessionToken or user not found' });
        }

        // Log deletion activity to UserLogs model
        const deletionActivity = `User ${username} has been successfully deleted`;
        await userLogs.create({ username: creatorUsername, activity: deletionActivity });

        // Perform user deletion using the User model
        const deletedUser = await User.destroy({ where: { username } });

        if (!deletedUser) {
            res.status(404).json({ success: false, error: 'User not found' });
        } else {
            res.json({ success: true, message: 'User deleted successfully' });
        }
    } catch (error) {
        console.error('Sequelize query error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
    }
});

app.get('/api/getLogs', async (req, res) => {
	
    try {
        // Query the database to fetch logs using Sequelize model
        const logs = await userLogs.findAll({
            attributes: ['id', 'username', 'activity', 'timestamp'],
        });

        // Format timestamps to a more readable format with timezone conversion
        const formattedLogs = logs.map((log) => ({
            id: log.id,
            username: log.username,
            activity: log.activity,
            timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'Asia/Singapore' }),
        }));

        // Send the formatted logs as a JSON response
        res.json(formattedLogs);
    } catch (error) {
        console.error('Sequelize query error:', error);
        res.status(500).json({ error: 'Error fetching logs from Sequelize' });
    }
});

app.get("/locations", isAuthenticated, async (req, res) => {

	try {
	  // Fetch data using Axios
	  const url = process.env.API_ALLLOCATION;
      const headers = {
		'auth-token': process.env.API_KEY,
	  };
	  const response = await axios.get(url, { headers });
	  const locationsData = response.data;
  
	  // Render the "locations" page with the fetched JSON data
	  res.render("locations", { locationsData, csrfToken: req.session.csrfToken, user:req.session.jobTitle});
	} catch (error) {
	  console.error("Error fetching locations:", error);
	  res.status(500).send("Internal Server Error");
	}
  });

  app.post('/location/new', locationValidation, async (req , res) => {

	try {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	  }

	  const user = await User.findOne({ where: { sessionid: sessionTokencookie } });
	  if (!user) {
		return res.status(403).json({ error: 'Invalid sessionToken' });
	  }
  
	  const submittedCSRFToken = req.body.csrf_token;
	  if (!req.session.csrfToken || submittedCSRFToken !== req.session.csrfToken) {
		return res.status(403).json({ error: 'CSRF token mismatch' });
	  }
	  
	  
	  const {name, added_by, description}  = req.body;
	  const preparedData = { name, added_by, description };
	  const url = process.env.API_NEWLOCATION;
	  const headers = {
		'auth-token': process.env.API_KEY,
		'Content-Type': 'application/json',
	  };
  
	  const axiosResponse = await axios.post(url, preparedData, { headers });
	  // Send the Axios response back to the client
	  res.status(axiosResponse.status).json(axiosResponse.data);
	} catch (error) {
	  console.error('Error handling new location submission:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  });
  

  app.post('/location/update', locationValidationUpdate, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    
        const user = await User.findOne({ where: { sessionid: sessionTokencookie } });
        
        if (!user) {
            return res.status(403).json({ error: 'Invalid sessionToken' });
        }

        const submittedCSRFToken = req.body.csrf_token;
        if (!req.session.csrfToken || submittedCSRFToken !== req.session.csrfToken) {
            return res.status(403).json({ error: 'CSRF token mismatch' });
        }

        const { id, name, added_by, description } = req.body;
        const preparedData = { id, name, added_by, description };

        const url = process.env.API_UPDATELOCATION;
        const headers = {
            'Content-Type': 'application/json',
			'auth-token': process.env.API_KEY,
        };

        const axiosResponse = await axios.put(url, preparedData, { headers });
        // Send the Axios response back to the client
        res.status(axiosResponse.status).json(axiosResponse.data);
    } catch (error) {
        console.error('Error handling location update:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


 
  app.delete('/location/delete', locationdeleteValidation, async (req, res) => {
	try {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	  }
  

	  const user = await User.findOne({ where: { sessionid: sessionTokencookie } });
	  if (!user) {
		  return res.status(403).json({ error: 'Invalid sessionToken' });
	  }
	  const submittedCSRFToken = req.body.csrf_token;
	  if (!req.session.csrfToken || submittedCSRFToken !== req.session.csrfToken) {
		  return res.status(403).json({ error: 'CSRF token mismatch' });
	  }

	  const {id} = req.body;
	  const preparedData = {id};
	  
	  const url = process.env.API_DELLOCATION;
      const headers = {
        'Content-Type': 'application/json',
		'auth-token': process.env.API_KEY,
	  };

	  const axiosResponse = await axios.delete(url, {
		headers,
		data: preparedData,
	  });
	  res.status(axiosResponse.status).json(axiosResponse.data);
	} catch (error) {
	  console.error('Error handling new sensor submission:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  });

app.get("/sensors", isAuthenticated, async (req, res) => {
	
	try {
		const url1 = process.env.API_ALLLOCATION;
		const url2 = process.env.API_ALLSENSOR;
        const headers = {
		'auth-token': process.env.API_KEY,
	  };
		// Render the inusers page with JSON data
		const response = await axios.get(url1, { headers});
		const locationsData = response.data;
		const response2 = await axios.get(url2, { headers});
		const sensorArray = response2.data;
		res.render("sensors",{locationsData, sensorArray, csrfToken: req.session.csrfToken, user:req.session.jobTitle});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Internal Server Error");
	}
});

  app.post('/sensor/new',sensorValidation, async (req, res) => {
	try {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	  }
	  
	 

	  const user = await User.findOne({ where: { sessionid: sessionTokencookie } });
	  if (!user) {
		  return res.status(403).json({ error: 'Invalid sessionToken' });
	  }
	  const submittedCSRFToken = req.body.csrf_token;
	  if (!req.session.csrfToken || submittedCSRFToken !== req.session.csrfToken) {
		  return res.status(403).json({ error: 'CSRF token mismatch' });
	  }
	  const { sensorname, added_by, mac_address, description, location} = req.body;
	  const preparedData = {sensorname, added_by, mac_address, description, location};

	  console.log(preparedData);
	  const url = process.env.API_NEWSENSOR;
      const headers = {
		'auth-token': process.env.API_KEY,
        'Content-Type': 'application/json',
	  };

	  const axiosResponse = await axios.post(url, preparedData, { headers });
	  res.status(axiosResponse.status).json(axiosResponse.data);
	} catch (error) {
	  console.error('Error handling new sensor submission:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  });

  app.post('/sensor/update',sensorupdateValidation, async (req, res) => {
	try {
	  const errors = validationResult(req);
	  console.log(errors);
	  if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	  }
	  
	

	  const user = await User.findOne({ where: { sessionid: sessionTokencookie } });
	  if (!user) {
		  return res.status(403).json({ error: 'Invalid sessionToken' });
	  }
	  const submittedCSRFToken = req.body.csrf_token;
	  if (!req.session.csrfToken || submittedCSRFToken !== req.session.csrfToken) {
		  return res.status(403).json({ error: 'CSRF token mismatch' });
	  }
	  const { id, sensorname, added_by, mac_address, description, location} = req.body;
	  const preparedData = {id, sensorname, added_by, mac_address, description, location};
	  console.log(preparedData);

	  const url = process.env.API_UPDATESENSOR;
      const headers = {
		'auth-token': process.env.API_KEY,
        'Content-Type': 'application/json',
	  };

	  const axiosResponse = await axios.put(url, preparedData, { headers });
	  res.status(axiosResponse.status).json(axiosResponse.data);
	} catch (error) {
	  console.error('Error handling new sensor submission:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  });

  app.delete('/sensor/delete',sensordeleteValidation, async (req, res) => {
	try {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	  }
	  

	  
	  const user = await User.findOne({ where: { sessionid: sessionTokencookie } });
	  if (!user) {
		  return res.status(403).json({ error: 'Invalid sessionToken' });
	  }
	  const submittedCSRFToken = req.body.csrf_token;
	  if (!req.session.csrfToken || submittedCSRFToken !== req.session.csrfToken) {
		  return res.status(403).json({ error: 'CSRF token mismatch' });
	  }
	  const {id} = req.body;
	  const preparedData = {id};
	  const url = process.env.API_DELSENSOR;
      const headers = {
		'auth-token': process.env.API_KEY,
        'Content-Type': 'application/json',
	  };

	  const axiosResponse = await axios.delete(url, {
		headers,
		data: preparedData,
	  });

	  res.status(axiosResponse.status).json(axiosResponse.data);
	} catch (error) {
	  console.error('Error handling new sensor submission:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  });

  app.get("/apilog", isAuthenticated, async (req, res) => {
	
	try {
		const url = process.env.API_LOGS;
		const headers = {
		  'auth-token': process.env.API_KEY,
		  'Content-Type': 'application/json',
		};
	  // Fetch data using Axios
	  const response = await axios.get(url, { headers});
	  const logData = response.data;
  
	  // Render the "locations" page with the fetched JSON data
	  res.render("apilog", {logData});
	} catch (error) {
	  console.error("Error fetching locations:", error);
	  res.status(500).send("Internal Server Error");
	}
  });


app.use(express.static("views"));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
