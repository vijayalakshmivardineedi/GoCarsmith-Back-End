const ServiceCenter=require('../../models/serviceCenter/auth')
const AdminCreation = require('../../models/serviceCenter/admincreation');
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt');
const shortid = require('shortid');
const { sendEmail } = require('../../validator/email');
const NodeCache = require('node-cache');
const emailVerificationCache = new NodeCache();
const saltRounds = 10;




const generateJwtToken = (_id, role) => {
    //console.log(process.env.JWT_SECRET)
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  }; 


  function generateVerificationCode() {
    // Generate a random verification code here, e.g., a 6-digit number
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }



  const generateServiceCenterId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serviceCenterId = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      serviceCenterId += characters[randomIndex];
    }
    return serviceCenterId;
  };
  
  

  
  exports.signup = (req, res) => {
    ServiceCenter.findOne({ email: req.body.email }).exec(async (error, serviceCenter) => {
      if (serviceCenter) {
        return res.status(400).json({
          message: "Service center already registered"
        });
      }
  
      const {
        firstName,
        secondName,
        email,
        password,
      } = req.body;
  
      const hash_password = await bcrypt.hash(password, 10);
      const serviceCenterId = generateServiceCenterId(); // Generate a unique serviceCenterId
  
      const _serviceCenter = new ServiceCenter({
        firstName,
        secondName,
        email,
        hash_password,
        serviceCenterId,
        serviceCenterName: shortid.generate(),
        role: "ServiceCenter"
      });
  
      _serviceCenter.save((error, data) => {
        if (error) {
          console.error("Error:", error);
          return res.status(400).json({
            message: "Something Went Wrong"
          });
        }
        if (data) {
          
            sendEmail(email, "Account Confirmation", `Hi ${firstName} \nWELCOME TO CAR_CARE. \nThe new serviceCenterId is successfully registerd. \n This is Your serviceCenterId ${serviceCenterId}`);
            return res.status(201).json({
              message: "ServiceCenter  created successfully"
            });
          }
        });
      });
    };

    exports.signin = (req, res) => {
      ServiceCenter.findOne({ email: req.body.email }).exec(async (error, serviceCenter) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
    
        try {
          if (serviceCenter) {
            const isPassword = await serviceCenter.authenticate(req.body.password);
            if (isPassword) {
              // Update the role check to "serviceCenter"
              if (serviceCenter.role === "ServiceCenter") {
                const token = generateJwtToken(serviceCenter._id, serviceCenter.role);
                const { _id, firstName, secondName, email, role, fullName, serviceCenterId, serviceCenterName, CenterCity } = serviceCenter;
                res.status(200).json({
                  token,
                  serviceCenter: { _id, firstName, secondName, email, role, fullName, serviceCenterId, serviceCenterName, CenterCity },
                });
              } else {
                return res.status(400).json({
                  message: "You do not have serviceCenter privileges",
                });
              }
            } else {
              return res.status(400).json({
                message: "Invalid Password",
              });
            }
          } else {
            return res.status(404).json({
              message: "Service Center not found",
            });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      });
    };
    
  
exports.signout=(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({
        message:'SignOut successfully...!'
    });
}



exports.getTotalServiceCentersWithDetails = async (req, res) => {
  try {
    const serviceCenterDetails = await ServiceCenter.find({ role: 'ServiceCenter' });
    const totalserviceCenter = serviceCenterDetails.length; // Get the total count

    res.json({ totalserviceCenter, serviceCenterDetails });
  } catch (err) {
    console.error("Error fetching total serviceCenter with details:", err);
    res.status(500).json({ error: 'Unable to fetch total serviceCenter with details' });
  }
};


exports.forgotPassword = (req, res) => {
  const to = req.body.email;
  const subject = 'Forgot Password Verification Code';

  // Assuming you have a database connection or ORM (e.g., Mongoose, Sequelize) set up
  // You would query your database to check if the email exists
  // Here, we'll assume you have a serviceCenter model for the database
  ServiceCenter.findOne({ email: to }, (err, serviceCenter) => {
      if (err) {
          // Handle the database error, e.g., log it and return an error response
          console.error("Database error:", err);
          res.status(500).send('Internal server error');
          return;
      }

      if (!serviceCenter) {
          // If the email doesn't exist in your database, you can return an error response
          res.status(404).send('Email not found in our database');
          return;
      }

      // If the email exists in your database, generate a verification code
      const verificationCode = generateVerificationCode();
      const text = `Your verification code is: ${verificationCode}`;

      // Log cache storage information
      console.log(`Storing verification code in cache for email: ${to}`);
      
      // Store the verification code in a cache with the serviceCenter's email
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
  
    // Code is valid, reset the serviceCenter's password
    ServiceCenter.findOne({ email: email }, (err, serviceCenter) => {
      if (err) {
        // Handle the database error
        console.error("Database error:", err);
        res.status(500).send('Internal server error');
        return;
  
      }
      if (!serviceCenter) {
        res.status(404).send('Email not found in our database');
        return;
      }
      
      // Manually hash and update the serviceCenter's password for password reset
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
  
      // Update the serviceCenter's hashed password
      serviceCenter.hash_password = hashedPassword;
  
      // Save the updated serviceCenter in the database
      serviceCenter.save((err) => {
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




  exports.checkEmailVerified = (req, res) => {
    const { email } = req.body;
  console.log(req.body.email)
    // Find the AdminCreation by email
    AdminCreation.findOne({ email }, (error, adminCreationData) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).json({
          message: 'Internal Server Error',
        });
      }
  
      if (!adminCreationData) {
        return res.status(404).json({
          message: 'AdminCreation not found',
        });
      }
  
      // Check if the email is verified
      const isEmailVerified = adminCreationData.isVerified || false;
  
      // Return the verification status
      return res.status(200).json({
        isEmailVerified,
      });
    });
  };


  exports.getServiceCenterProfileDetailsByUsingServiceCenterId = async (req, res) => {
    const { serviceCenterId } = req.params;
    try {
      // Manually hash and update the serviceCenter's password for password reset
      const getDetails = await ServiceCenter.findById(serviceCenterId);
      if (!getDetails) {
        return res.status(404).json({ message: "Service Center Data Not Found" });
      }
      return res.json(getDetails);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  };


exports.updateTheserviceCenterProfile =  async (req, res) => {
  const { serviceCenterId } = req.params;
  try {
    const formData = req.body;
    
    // Find and update the service center request by its ID
    const updateStatus = await ServiceCenter.findByIdAndUpdate(
      serviceCenterId,
      { $set: formData }, // Update with formData only
      { new: true } // Return the updated document
    );
    
    if (!updateStatus) {
      return res.status(404).json({ message: 'Service center request not found' });
    }
    
    res.json(updateStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};