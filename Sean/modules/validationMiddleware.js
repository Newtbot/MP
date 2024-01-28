const {body } = require('express-validator');

const locationValidation = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty').escape(),
  body('added_by').trim().isLength({ min: 1 }).withMessage('Added by must not be empty').escape(),
  body('description').trim().escape(),
];

const locationValidationUpdate = [
	body('id').trim().escape(),
	body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty').escape(),
	body('added_by').trim().isLength({ min: 1 }).withMessage('Added by must not be empty').escape(),
	body('description').trim().escape(),
  ];

const locationdeleteValidation = [
	body('id').trim().escape()
  ];

const sensorValidation = [
	body('sensorname').trim().isLength({ min: 1 }).withMessage('Sensor Name must not be empty').escape(),
	body('added_by').trim().isLength({ min: 1 }).withMessage('Added by must not be empty').escape(),
	body('macAddress').custom(value => {
	  const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
	  if (!macAddressRegex.test(value)) {
		throw new Error('Invalid MAC address format');
	  }
	  return true;
	}).withMessage('Invalid MAC address format').escape(),
	body('description').trim().escape(),
	body('location').trim().escape()
  ];

const sensorupdateValidation = [
	body('id').trim().escape(),
	body('sensorname').trim().isLength({ min: 1 }).withMessage('Sensor Name must not be empty').escape(),
	body('added_by').trim().isLength({ min: 1 }).withMessage('Added by must not be empty').escape(),
	body('macAddress').custom(value => {
	  const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
	  if (!macAddressRegex.test(value)) {
		throw new Error('Invalid MAC address format');
	  }
	  return true;
	}).withMessage('Invalid MAC address format').escape(),
	body('description').trim().escape(),
	body('location').trim().escape()
  ];

const sensordeleteValidation = [
	body('id').trim().escape()
  ];

const loginValidation = [
	body('username').escape().trim().isLength({ min: 1 }).withMessage('Username must not be empty'),
  body('password').escape().trim().isLength({ min: 1 }).withMessage('Password must not be empty'),
  ];

const otpValidation = [
	body('otp').escape().trim().isLength({ min: 1 }).withMessage('OTP must not be empty'),
  ];

const createValidation = [
	body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty').escape(),
    body('username').trim().isLength({ min: 1 }).withMessage('Username must not be empty').escape(),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').escape().trim().custom((value) => {
            if (!isStrongPassword(value)) { throw new Error('Password does not meet complexity requirements'); } return true;
        }),
    body('jobTitle').trim().isLength({ min: 1 }).withMessage('Job title must not be empty').escape(),
  ]; 
  
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
module.exports = {
  locationValidation,locationValidationUpdate,locationdeleteValidation
  ,sensorValidation,sensorupdateValidation,sensordeleteValidation,loginValidation,otpValidation
  ,createValidation
};


