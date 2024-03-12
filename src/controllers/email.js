const User = require("../models/user/auth");
const Employee = require("../models/employee/auth");
const ServiceCenter = require("../models/serviceCenter/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { sendEmail, imapConfig } = require("../validator/email");
const NodeCache = require('node-cache');
const emailVerificationCache = new NodeCache();
const saltRounds = 10;
const Imap = require('node-imap');
const notifier = require('node-notifier');
const emailValidator = require('email-validator');
let unseenEmailCount = 0;


function generateVerificationCode() {
  // Generate a random verification code here, e.g., a 6-digit number
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}


const generateVerificationToken = (email) => {
  // Implement your token generation logic here
  // For example, you can use a library like crypto to generate a random token
  const crypto = require('crypto');
  const tokenLength = 40; // The length of the random token part
  const tokenBytes = crypto.randomBytes(tokenLength / 2);
  const randomToken = tokenBytes.toString('hex');
  
  // Include the token's expiration time, which is 10 minutes from the current time
  const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

  // Combine the random token, expiration time, and the email address with a delimiter
  const tokenWithExpiration = `${randomToken}:${expirationTime}:${email}`;

  return tokenWithExpiration;
};





exports.sendVerificationEmail = (req, res) => {
  const to = req.body.email;

  // Check if the provided email is valid
  if (!emailValidator.validate(to)) {
    // The email is not valid
    res.status(400).send('Invalid email address');
    return;
  }

  const subject = 'Email Verification';
  const verificationToken = generateVerificationToken(to);
  const verificationLink = `http://localhost:2000/api/verifyEmail?token=${verificationToken}`;
  const text = `Click the following link to verify your email: ${verificationLink}`;

  // Add a console.log statement to check the values of variables
  console.log("Sending verification email to:", to);
  console.log("Verification Token:", verificationToken);

  // Save the verification token in the cache
  emailVerificationCache.set(verificationToken, to, 600);

  // Check if the token is saved in the cache and print it
  const cachedEmail = emailVerificationCache.get(verificationToken);

  if (cachedEmail === to) {
    // The token is in the cache
    console.log("Verification token is saved in the cache.");
    console.log("Cached Email:", cachedEmail);
    console.log("Cached Token:", verificationToken);
  } else {
    // The token is not in the cache
    console.log("Verification token is not saved in the cache.");
  }

  // Use the sendEmail function to send the verification email
  sendEmail(to, subject, text, (error, message) => {
    if (error) {
      res.status(500).send('Email sending failed: ' + error);
    } else {
      res.send('Email sent: ' + message);
    }
  });
};







exports.verifyEmail = (req, res) => {
  const token = req.query.token;
  const email = emailVerificationCache.get(token);

 

  if (!email) {

    res.redirect('https://gocarsmithbackend.onrender.com/error'); // Redirect to the error page
  } else {
    // Token is valid, mark the email as verified
    // Update your database here if needed

    // You can remove the token from the cache since it's been used
    emailVerificationCache.del(token);

 
    res.redirect('https://gocarsmithbackend.onrender.com/success'); // Redirect to the success page
  }
};




exports.forgotPassword = (req, res) => {
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

    // Store the verification code in a cache with the user's email
    emailVerificationCache.set(to, verificationCode, 600);

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





exports.getEmailNotifications = () => {
  const checkEmail = () => {
    const imap = new Imap(imapConfig);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) throw err;

        // Search for unseen emails
        imap.search(['UNSEEN'], (err, results) => {
          if (err) throw err;

          // Update the unseen email count
          unseenEmailCount = results.length;

          if (unseenEmailCount === 0) {
           
            imap.end();
          } else {
            console.log(`Received ${unseenEmailCount} new email(s)`);

            // Show a notification with the count
            notifier.notify({
              title: 'New Emails',
              message: `You have ${unseenEmailCount} new email(s)`,
            });

            const fetch = imap.fetch(results, { bodies: '', markSeen: true });

            fetch.on('message', (msg, seqno) => {
              msg.on('body', (stream, info) => {
                let buffer = '';

                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });

                stream.on('end', () => {
                  // 'buffer' contains the email content
                  
                  console.log(buffer);

                  // You can process the email content as needed here
                });
              });
            });

            fetch.once('error', (err) => {
              console.error('Fetch error:', err);
            });

            fetch.once('end', () => {
              imap.end();
            });
          }
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP connection error:', err);
    });

    imap.once('end', () => {
      console.log('IMAP connection ended');
      // Set up the next check after a delay (e.g., 1 minute)
      setTimeout(checkEmail, 30 * 1000);
    });

    imap.connect();
  };

  // Initial check when the function is called
  checkEmail();
};


exports.sendNotifications = (req, res) => {
  const to = req.body.email;

  // Check if the provided email is valid
  if (!emailValidator.validate(to)) {
    // The email is not valid
    res.status(400).send('Invalid email address');
    return;
  }

  const subject = 'Notifications';
  const text = 'Email Verification';


  // Call the sendEmail function with a callback
  sendEmail(to, subject, text, (error, info) => {
    if (error) {
      res.status(500).send('Email sending failed: ' + error);
    } else {
      res.send(info);
    }
  });
};





exports.sendEmailNotificationsToAllUsers = (req, res) => {
  const subject = 'Notification Subject';

  // Assuming you have a database connection or ORM (e.g., Mongoose, Sequelize) set up
  // You would query your database to retrieve all users
  // Here, we'll assume you have a User model for the database
  User.countDocuments({}, (err, totalUsersCount) => {
    if (err) {
      // Handle the database error, e.g., log it and return an error response
      console.error("Database error:", err);
      res.status(500).send('Internal server error');
      return;
    }

    if (totalUsersCount === 0) {
      // If there are no users in your database, you can return an error response
      res.status(404).send('No users found in our database');
      return;
    }

    console.log(`Total users in the database: ${totalUsersCount}`);

    const emailPromises = [];

    User.find({}, (err, users) => {
      if (err) {
        console.error("Database error:", err);
        res.status(500).send('Internal server error');
        return;
      }

      users.forEach((user) => {
        const to = user.email;

        // Generate the email content here (e.g., text, HTML, etc.)
        const text = `Hello ${user.firstName}, this is a notification email.`;

        // Use the sendEmail function to send the email
        const emailPromise = sendEmail(to, subject, text);
        emailPromises.push(emailPromise);
      });

      // Log the number of emails being sent
      console.log(`Sending ${emailPromises.length} email notifications...`);

      // Wait for all email promises to complete
      Promise.all(emailPromises)
        .then(() => {
          console.log('All email notifications sent successfully.');
          res.send('Email notifications sent to all users');
        })
        .catch((error) => {
          console.error("Error sending emails:", error);
          res.status(500).send('Error sending email notifications');
        });
    });
  });
};




exports.sendEmailNotificationsToAllEmployee = (req, res) => {
  const subject = 'Notification Subject';

  // Assuming you have a database connection or ORM (e.g., Mongoose, Sequelize) set up
  // You would query your database to retrieve all employee
  // Here, we'll assume you have a Employee model for the database
  Employee.countDocuments({}, (err, totalEmployeeCount) => {
    if (err) {
      // Handle the database error, e.g., log it and return an error response
      console.error("Database error:", err);
      res.status(500).send('Internal server error');
      return;
    }

    if (totalEmployeeCount === 0) {
      // If there are no employee in your database, you can return an error response
      res.status(404).send('No employee found in our database');
      return;
    }

    console.log(`Total employee in the database: ${totalEmployeeCount}`);

    const emailPromises = [];

    Employee.find({}, (err, employees) => {
      if (err) {
        console.error("Database error:", err);
        res.status(500).send('Internal server error');
        return;
      }

      employees.forEach((employee) => {
        const to = employee.email;

        // Generate the email content here (e.g., text, HTML, etc.)
        const text = `Hello ${employee.firstName}, this is a notification email.`;

        // Use the sendEmail function to send the email
        const emailPromise = sendEmail(to, subject, text);
        emailPromises.push(emailPromise);
      });

      // Log the number of emails being sent
      console.log(`Sending ${emailPromises.length} email notifications...`);

      // Wait for all email promises to complete
      Promise.all(emailPromises)
        .then(() => {
          console.log('All email notifications sent successfully.');
          res.send('Email notifications sent to all employees');
        })
        .catch((error) => {
          console.error("Error sending emails:", error);
          res.status(500).send('Error sending email notifications');
        });
    });
  });
};





exports.sendEmailNotificationsToAllServiceCenters = (req, res) => {
    const subject = 'Notification Subject';
  
    // Assuming you have a database connection or ORM (e.g., Mongoose, Sequelize) set up
    // You would query your database to retrieve all serviceCenters
    // Here, we'll assume you have a ServiceCenter model for the database
    ServiceCenter.countDocuments({}, (err, totalServiceCentersCount) => {
      if (err) {
        // Handle the database error, e.g., log it and return an error response
        console.error("Database error:", err);
        res.status(500).send('Internal server error');
        return;
      }
  
      if (totalServiceCentersCount === 0) {
        // If there are no serviceCenters in your database, you can return an error response
        res.status(404).send('No serviceCenters found in our database');
        return;
      }
  
      console.log(`Total serviceCenters in the database: ${totalServiceCentersCount}`);
  
      const emailPromises = [];
  
      ServiceCenter.find({}, (err, serviceCenters) => {
        if (err) {
          console.error("Database error:", err);
          res.status(500).send('Internal server error');
          return;
        }
  
        serviceCenters.forEach((serviceCenter) => {
          const to = serviceCenter.email;
  
          // Generate the email content here (e.g., text, HTML, etc.)
          const text = `Hello ${serviceCenter.firstName}, this is a notification email.`;
  
          // Use the sendEmail function to send the email
          const emailPromise = sendEmail(to, subject, text);
          emailPromises.push(emailPromise);
        });
  
        // Log the number of emails being sent
        console.log(`Sending ${emailPromises.length} email notifications...`);
  
        // Wait for all email promises to complete
        Promise.all(emailPromises)
          .then(() => {
            console.log('All email notifications sent successfully.');
            res.send('Email notifications sent to all serviceCenters');
          })
          .catch((error) => {
            console.error("Error sending emails:", error);
            res.status(500).send('Error sending email notifications');
          });
      });
    });
  };
  


  