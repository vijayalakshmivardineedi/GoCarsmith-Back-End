const ServiceCenter = require('../../models/serviceCenter/auth');
const AdminCreation = require('../../models/serviceCenter/admincreation');
const { sendEmail } = require('../../validator/email');
const NodeCache = require('node-cache');
const emailVerificationCache = new NodeCache();


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

exports.generateAndSendServiceCenterOTP = async (req, res) => {
  try {
    // Check if the email is already registered in the database
    const existingServiceCenter = await ServiceCenter.findOne({ email: req.body.email }).exec();

    if (existingServiceCenter) {
      return res.status(400).json({
        message: 'ServiceCenter already registered. Please sign in.',
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

    // Store the verification code in a cache with the serviceCenter's email
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
    console.error('Error checking ServiceCenter existence:', error);
    res.status(500).json({
      message: 'Internal server error',
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

  // OTP is valid, you can proceed to save Service Center details
  emailVerificationCache.del(email);

  // Generate a unique serviceCenterId and serviceCenterName
  const serviceCenterId = generateServiceCenterId();

  // Save details in the AdminCreation database only
  const newAdminCreation = new AdminCreation({
    email,
    serviceCenterId,
    isVerified: true, // Set isVerified to true
    // Add other relevant fields here
  });

  newAdminCreation.save((adminCreationError, adminCreationData) => {
    if (adminCreationError) {
      console.error('Error saving AdminCreation details:', adminCreationError);
      // Handle the error appropriately
      return res.status(400).json({
        message: 'Failed to save AdminCreation details',
      });
    }

    // Optionally, you can generate a JWT token here and send it in the response
    return res.status(200).json({
      serviceCenter: {
        email: adminCreationData.email,
        isVerified: adminCreationData.isVerified,
        // Include other AdminCreation details if needed
      },
    });
  });
};


exports.getservicecenterbyemail = (req, res) => {
  const { email } = req.params;

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

    // Return all AdminCreation details
    return res.status(200).json({
      adminCreation: adminCreationData.toObject(),
    });
  });
};
