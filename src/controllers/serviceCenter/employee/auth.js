const Employee=require('../../../models/serviceCenter/employee/auth');
const bcrypt=require('bcrypt');
const shortid = require('shortid');
const { sendEmail } = require("../../../validator/email");
const NodeCache = require('node-cache');
const { generateJwtToken, generateVerificationCode, generateVerificationToken } = require('../../../common-middleware/code');
const emailVerificationCache = new NodeCache();
const saltRounds = 10;
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const generatedEmployeeIds = new Set(); // To store generated IDs
const generateEmployeeId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let employeeId;
  let numberOfNumbers = 0;
  do {
    employeeId = 'GCS';
    numberOfNumbers = 0;
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const randomChar = characters[randomIndex];
      // Check if the character is a number
      if (/\d/.test(randomChar)) {
        numberOfNumbers++;
      }
      employeeId += randomChar;
    }
  } while (generatedEmployeeIds.has(employeeId) || numberOfNumbers < 3); // Check for uniqueness and at least three numbers
  generatedEmployeeIds.add(employeeId); // Add the generated ID to the set
  return employeeId;
};
// Example usage:
const newEmployeeId = generateEmployeeId();




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

  
exports.signup = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.body.email });

    if (employee) {
      return res.status(400).json({
        message: "Employee already registered",
      });
    }

    const {
      serviceCenterId,
      firstName,
      secondName,
      email,
      contactNumber,
      password,
      Address,
      role,
    } = req.body;

    const hash_password = await bcrypt.hash(password, 10);
    const employeeId = generateEmployeeId(); // Generate a unique employeeId

    const newEmployee = new Employee({
      serviceCenterId,
      firstName,
      secondName,
      email,
      Address,
      contactNumber,
      hash_password,
      employeeId,
      role,
    });

    // Set the employeeName using the fullName virtual property
    newEmployee.employeeName = newEmployee.fullName;

    await newEmployee.save();

    // Send confirmation email
    sendEmail(
      email,
      "Account Confirmation",
      `Hi ${firstName} \nYour are now an employee in our organization.\n This is Your EmployeeId ${employeeId}.`
    );

    return res.status(201).json({
      message: "Employee created successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


exports.signin = (req, res) => {
  Employee.findOne({ email: req.body.email }).exec(async (error, employee) => {
      if (error) return res.status(400).json({ error });
      if (employee) {
        const isPassword = await employee.authenticate(req.body.password);
        if (isPassword) {
          // Update the role check to "employee"
          if (employee.role === "employee") {
            const token = generateJwtToken(employee._id, employee.role);
            const { _id, firstName, secondName, email, role, fullName, employeeId } = employee;
            res.status(200).json({
              token,
              employee: { _id, firstName, secondName, email, role, fullName, employeeId },
            });
          } else {
            return res.status(400).json({
              message: "You do not have employee privileges",
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
  
  
exports.signout=(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({
        message:'SignOut successfully...!'
    });
}


exports.getTotalEmployeeWithDetails = async (req, res) => {
  try {
    const employeeDetails = await Employee.find();
    const totalemployee = employeeDetails.length; // Get the total count

    res.json({ totalemployee, employeeDetails });
  } catch (err) {
    console.error("Error fetching total employee with details:", err);
    res.status(500).json({ error: 'Unable to fetch total employee with details' });
  }
};

exports.getEmployeesByServiceCenter = async (req, res) => {
  const { serviceCenterId } = req.params;

  try {
    // Validate and cast the serviceCenterId to ObjectId
    const isValidObjectId = ObjectId.isValid(serviceCenterId);

    if (!isValidObjectId) {
      throw new Error('Invalid serviceCenterId format');
    }

    // Fetch employees based on the specified service center ID
    const employeeDetails = await Employee.find({ serviceCenterId: serviceCenterId });

    // Get the total count
    const totalEmployees = employeeDetails.length;

    res.json({ totalEmployees, employeeDetails });
  } catch (err) {
    console.error("Error fetching employees by service center ID:", err);
    res.status(500).json({ error: 'Unable to fetch employees by service center ID' });
  }
};


exports.forgotPassword = (req, res) => {
  const to = req.body.email;
  const subject = 'Forgot Password Verification Code';

  // Assuming you have a database connection or ORM (e.g., Mongoose, Sequelize) set up
  // You would query your database to check if the email exists
  // Here, we'll assume you have a Employee model for the database
  Employee.findOne({ email: to }, (err, employee) => {
      if (err) {
          // Handle the database error, e.g., log it and return an error response
          console.error("Database error:", err);
          res.status(500).send('Internal server error');
          return;
      }

      if (!employee) {
          // If the email doesn't exist in your database, you can return an error response
          res.status(404).send('Email not found in our database');
          return;
      }

      // If the email exists in your database, generate a verification code
      const verificationCode = generateVerificationCode();
      const text = `Your verification code is: ${verificationCode}`;

      // Log cache storage information
      console.log(`Storing verification code in cache for email: ${to}`);
      
      // Store the verification code in a cache with the employee's email
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
  
    // Code is valid, reset the employee's password
    Employee.findOne({ email: email }, (err, employee) => {
      if (err) {
        // Handle the database error
        console.error("Database error:", err);
        res.status(500).send('Internal server error');
        return;
  
      }
      if (!employee) {
        res.status(404).send('Email not found in our database');
        return;
      }
      
      // Manually hash and update the employee's password for password reset
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
  
      // Update the employee's hashed password
      employee.hash_password = hashedPassword;
  
      // Save the updated employee in the database
      employee.save((err) => {
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

  exports.updateEmployee = async (req, res) => {
    try {
      // Retrieve employee ID from the request parameters
      const { employeeId } = req.params;
  
      // Find the employee in the database
      const employee = await Employee.findOne({ employeeId });
  
      // If the employee is not found, return an error response
      if (!employee) {
        return res.status(404).json({
          message: 'Employee not found',
        });
      }
  
      // Destructure updated data from the request body
      const {
        firstName,
        secondName,
        contactNumber,
        Address,
        newPassword,
        // profilePicture, // If you want to update the password, include the newPassword field
      } = req.body;
  
      // Update employee data with the new values
      employee.firstName = firstName || employee.firstName;
      employee.secondName = secondName || employee.secondName;
      employee.contactNumber = contactNumber || employee.contactNumber;
      employee.Address = Address || employee.Address;
  
      // If newPassword is provided, update the password
      if (newPassword) {
        const hash_password = await bcrypt.hash(newPassword, 10);
        employee.hash_password = hash_password;
      }
  
      
  
      // Save the updated employee in the database
      await employee.save();
  
      // Return a success response
      return res.status(200).json({
        message: 'Employee data updated successfully',
        employee,
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };

   
 exports.deleteEmployee = async (req, res) => {
    try {
      // Extract employee id from the request parameters
      const { employeeId } = req.params;
    
  
      // Find the employee by id and remove it
      const deletedEmployee = await Employee.findOneAndRemove({ employeeId: employeeId });
  
      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Employee deleted successfully', deletedEmployee });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  
  
  
  
  
  