const User = require('../../models/user/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const { sendEmail } = require('../../validator/email');
const NodeCache = require('node-cache');
const emailVerificationCache = new NodeCache();
const saltRounds = 10;
const path = require('path');

const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');

const ServiceCenter = require('../../models/serviceCenter/auth')



const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

function generateVerificationCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}





exports.generateAndSendOTP = async (req, res) => {
  try {
    // Check if the email is already registered in the database
    const existingUser = await User.findOne({ email: req.body.email }).exec();
    
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered. Please sign in.",
      });
    }

    // If the email is not in the database, proceed to generate and send OTP

    const to = req.body.email;
    const subject = 'Login OTP';

    // Assuming you have already validated the email on the client side or through some other mechanism
    // You can directly proceed to generate a verification code

    // Generate a verification code
    const verificationCode = generateVerificationCode();
    const text = `Your OTP is: ${verificationCode}`;

    // Log cache storage information
    console.log(`Storing verification code in cache for email: ${to}`);
    
    // Store the verification code in a cache with the user's email
    emailVerificationCache.set(to, verificationCode, 300);

    // Log email sending information
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Email content: ${text}`);

    // Use the sendEmail function to send the verification email
    sendEmail(to, subject, text);

    res.json({
      message: 'OTP sent successfully. Check in your email.',
    });
    
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  // Check if the entered OTP matches the stored OTP
  const storedOTP = emailVerificationCache.get(email);

  if (!storedOTP || storedOTP !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP is valid, you can proceed without finding the user
  // Optionally, clear the OTP from cache after successful login
  emailVerificationCache.del(email);

  // Generate JWT token
  return res.status(200).json({
    
    user: {
      email, // Include other user details if needed
    },
  });
};



exports.signup = (req, res) => {
  console.log("this is user")
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        message: "User already registered",
      });
    }
    const { firstName, secondName, email, password, contactNumber } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      secondName,
      email,
      contactNumber,
      hash_password,
      username: shortid.generate(),
      role: "user",
    });

    _user.save((error, data) => {
      if (error) {
        console.error("Error saving user:", error);
        return res.status(400).json({
          message: "Something Went Wrong",
        });
      }
      if (data) {
        sendEmail(email, "Account Creation", `Hi ${firstName},\n WELCOME TO GOCARSMITH \nYour account has been successfully created.`);
       return res.status(201).json({
          message: "User created successfully",
        });
      }
    });
  });
};


exports.signout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    message: 'SignOut successfully...!'
  });
}


exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword) {
        // You may want to check for role here and handle user-specific logic
        if (user.role === "user") {
          const token = generateJwtToken(user._id, user.role);
          const { _id, firstName, secondName, email, role, fullName,  } = user;
          res.status(200).json({
            token,
            user: { _id, firstName, secondName, email, role, fullName },
          });
        } else {
          return res.status(400).json({
            message: "You do not have user privileges",
          });
        }
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  });
};


exports.getUserByEmail = (req, res) => {
  const { email } = req.params; // Assuming the email is part of the URL params

  User.findOne({ email }).exec((error, user) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (user) {
      res.status(200).json({
        user,
      });
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  });
};


exports.forgotPassword = (req, res) => {
  console.log("this is user")
  const to = req.body.email;
  const subject = 'Forgot Password Verification Code';

  // Assuming you have a database connection or ORM (e.g., Mongoose, Sequelize) set up
  // You would query your database to check if the email exists
  // Here, we'll assume you have a User model for the database
  User.findOne({ email: to }, (err, user) => {
    if (err) {
      // Handle the database error, e.g., log it and return an error response
      console.error("Database error:", err);
      res.status(500).send('Internal server error');
      return;
    }

    if (!user) {
      // If the email doesn't exist in your database, you can return an error response
      res.status(404).send('Email not found in our database');
      return;
    }

    // If the email exists in your database, generate a verification code
    const verificationCode = generateVerificationCode();
    const text = `Your verification code is: ${verificationCode}`;

    // Log cache storage information
    console.log(`Storing verification code in cache for email: ${to}`);

    // Store the verification code in a cache with the user's email
    emailVerificationCache.set(to, verificationCode, 600);

    // Log email sending information
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Email content: ${text}`);

    // Use the sendEmail function to send the verification email
    sendEmail(to, subject, text);

    res.send('Verification code sent to your email');
  });
};



// Add a new route for code verification and password reset
exports.verifyCodeAndResetPassword = (req, res) => {
  const email = req.body.email;
  const code = req.body.code;
  const newPassword = req.body.newPassword;

  // Check if the provided code matches the one stored in the cache
  const storedCode = emailVerificationCache.get(email);


  if (!storedCode || storedCode !== code) {
    res.status(400).send('Invalid verification code');
    return;
  }

  // Code is valid, reset the user's password
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      // Handle the database error
      console.error("Database error:", err);
      res.status(500).send('Internal server error');
      return;

    }
    if (!user) {
      res.status(404).send('Email not found in our database');
      return;
    }

    // Manually hash and update the user's password for password reset
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    // Update the user's hashed password
    user.hash_password = hashedPassword;

    // Save the updated user in the database
    user.save((err) => {
      if (err) {
        console.error("Password reset error:", err);
        res.status(500).send('Error resetting password');
      } else {
        // Password reset successful
        res.send('Password reset successfully');
      }
    });
  });
};


exports.updateProfile = async (req, res) => {
  // Set up multer storage for profile picture uploads
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destinationPath = path.join(__dirname, '../../uploadsImagesUser');
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage }).single('profilePicture');
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading profile picture:', err);
      return res.status(500).json({ success: false, message: 'An error occurred while uploading profile picture.' });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found with the provided email.' });
      }
      user.firstName = req.body.firstName || user.firstName;
      user.secondName = req.body.secondName || user.secondName;
      user.contactNumber = req.body.contactNumber || user.contactNumber;
      const profilePicture = req.file;
      if (profilePicture) {
        
        if (!user.attachments) {
          user.attachments = [];
        }
        const attachment = {
          filename: profilePicture.originalname,
          content: profilePicture.buffer,
          path: profilePicture.path,
        };
        user.attachments.push(attachment);
        // Define profilePicturePath here
        const profilePicturePath = path.join(__dirname, '../../uploadsImagesUser', profilePicture.filename);
        user.profilePicture = `/publicimages/${path.basename(profilePicturePath)}`;
        // Use fs to read the file and then write it
        const fileData = fs.readFileSync(profilePicture.path);
        fs.writeFileSync(profilePicturePath, fileData);
      } else {
        // Handle the case where profilePicture is undefined
        return res.status(400).json({ success: false, message: 'Profile picture not provided.' });
      }
      await user.save();
      return res.status(200).json({ success: true, message: 'User profile updated successfully.' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while updating user profile.' });
    }
  });
};

exports.getUserByEmail = (req, res) => {
  const { email } = req.params; // Assuming the email is part of the URL params
  User.findOne({ email }).exec((error, user) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (user) {
      res.status(200).json({
        user,
      });
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  });
};


exports.addCarsToUser = async (req, res) => {
  
  const { email, carsData } = req.body;
 
  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with the provided email.' });
    }

    // For each car in carsData, add it to the mycars array
    user.mycars.push(...carsData);

    // Save the updated user document
    await user.save();

    return res.status(200).json({ success: true, message: 'Cars added to the user successfully.' });
  } catch (error) {
    console.error('Error adding cars to user:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while adding cars to the user.' });
  }
};



exports.getCarsByEmail = async (req, res) => {
  const { email } = req.params; // Use req.params.email to get the email from the route parameters
 
  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with the provided email.' });
    }

    // Retrieve and send the user's car details
    const carsData = user.mycars;
    return res.status(200).json({ success: true, carsData });
  } catch (error) {
    console.error('Error getting cars by email:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while getting cars by email.' });
  }
};

exports.deleteCar = async (req, res) => {
  const { email, carId } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with the provided email.' });
    }

    // Find and remove the car with the given carId from mycars array
    user.mycars = user.mycars.filter((car) => car._id.toString() !== carId);
    await user.save();

    return res.status(200).json({ success: true, message: 'Car deleted successfully.' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while deleting the car.' });
  }
};

exports.editKilometers = async (req, res) => {
  const { email, carId } = req.params;
  const { kilometers } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with the provided email.' });
    }

    // Find the car with the given carId and update the kilometers
    const carToUpdate = user.mycars.find((car) => car._id.toString() === carId);

    if (!carToUpdate) {
      return res.status(404).json({ success: false, message: 'Car not found with the provided carId.' });
    }

    carToUpdate.kilometers = kilometers;
    await user.save();

    return res.status(200).json({ success: true, message: 'Kilometers updated successfully.' });
  } catch (error) {
    console.error('Error editing kilometers:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while editing kilometers.' });
  }
};



exports.getServicesCenterByLocation = async (req, res) => {
  
      const _id = req.params._id;
  
      try {
          // Convert the string _id to ObjectId
          const locationObjectId = mongoose.Types.ObjectId(_id);
  
          const getServiceCenters = await ServiceCenter.find({
              locations: locationObjectId,
              approved: true
          });
  
          if (!getServiceCenters || getServiceCenters.length === 0) {
             
              return res.json([]); // Send an empty array as a response
          }
  
          res.json(getServiceCenters);
      } catch (err) {
          console.error("Error fetching total serviceCenter with details:", err);
          res.status(500).json({ error: 'Unable to fetch total serviceCenter with details' });
      }
  };


  exports.getUsersForAdminPanel = async (req, res) => {
    try {
      const userDetails = await User.find({ role: 'user' });
  // Get the total count
      res.json( userDetails );
    } catch (err) {
      console.error("Error fetching total users with details:", err);
      res.status(500).json({ error: 'Unable to fetch total users with details' });
    }
  };






  exports.deleteProfileImage = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found with the provided email.' });
      }
      // Check if the user has a profile picture
      if (!user.profilePicture) {
        return res.status(400).json({ success: false, message: 'User does not have a profile picture.' });
      }
      // Extract the filename from the profile picture URL
      const filename = path.basename(user.profilePicture);
      // Construct the path to the profile picture
      const profilePicturePath = path.join(__dirname, '../../uploadsImagesUser', filename);
      // Delete the profile picture file from the filesystem
      fs.unlinkSync(profilePicturePath);
      // Remove the profile picture reference from the user object
      user.profilePicture = undefined;
      // Save the updated user object
      await user.save();
      return res.status(200).json({ success: true, message: 'Profile picture deleted successfully.' });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while deleting profile picture.' });
    }
  };
  