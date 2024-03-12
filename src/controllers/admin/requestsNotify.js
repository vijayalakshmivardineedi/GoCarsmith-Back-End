const Request=require('../../models/serviceCenter/request');
const { sendEmail } = require("../../validator/email");


exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().sort({createdAt: -1});
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.approveRequest = async (req, res) => {
  try {
    const requestId = req.body.id;
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { approvalStatus: 'approved' },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    const userName = updatedRequest.name; // Assuming 'name' is the field in your Request model
    const userEmail = updatedRequest.email;
    sendEmail(
      userEmail,
      'Request Approved',
      `Hi ${userName},<br><br>Congratulations! Your request has been approved. Our team will contact you.`
    );
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.deleteRequest = async (req, res) => {
  try {
    const requestId = req.body.id;
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { approvalStatus: 'declined' },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    const userName = updatedRequest.name; // Assuming 'name' is the field in your Request model
    const userEmail = updatedRequest.email;
    sendEmail(
      userEmail,
      'Request Declined',
      `Hi ${userName},<br><br>Your request has been declined. Please contact our team for more information.`
    );
    res.status(200).json({ message: 'Request status updated to declined' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};