const Request=require('../../models/serviceCenter/request')
const { sendEmail } = require('../../validator/email');


exports.requestAsPatner = async (req, res) => {
try {
    const { name, email, locality, workshopDetails, mobileNumber, workshopName } = req.body;
    // Validate that all required fields are present
    if (!name || !email || !locality || !workshopDetails || !mobileNumber || !workshopName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newRequest = new Request({
      name,
      email,
      locality,
      workshopDetails,
      workshopName,
      mobileNumber,
    });
    await newRequest.save();
    // Send confirmation email
    sendEmail(
      email,
      'Request Received',
      `Hi ${name},\nWelcome to GoCarsmith.\nYour request of ${workshopName} as a ${workshopDetails} has been successfully submitted. \nOur team will contact You Soon.`
    );
    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};