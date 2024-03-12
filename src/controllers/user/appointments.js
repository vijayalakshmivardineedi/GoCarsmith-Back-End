
const appointmentData = require("../../models/user/appointments");
const User = require('../../models/user/auth');

exports.AddAppointment = async (req, res) => {
  try {

    const {
      userId,
      formData, // Corrected property name
      carModel,
      Brand,
      imagePath,
      email,
      fuelType,
      serviceCenterId,
      paymentMethod,
      currentDate,
      selectedSlot,
      servicesList,
      subTotal,
     gst,
      Discount,
      SafetyFee,
    } = req.body;
    const newAppointment = new appointmentData ({
        userId:userId,
        customerLocation:{
        firstName:formData.firstName,
        lastName:formData.lastName,
        address1:formData.address1,
        address2:formData.address2,
        city:formData.city,
        state:formData.state,
        zip:formData.zip,
        country:formData.country,
        phoneNumber:formData.phoneNumber
      }, // Corrected property name
      customerName:`${formData.firstName} ${formData.lastName}`,
      contactNumber:formData.phoneNumber,
      paymentMethod:paymentMethod,
      carModel:carModel,
      email:email,
      Brand:Brand,
      imagePath:imagePath,
      serviceCenterId:serviceCenterId,
      listOfServices:servicesList,
      fuelType:fuelType,
      appointmentDate: currentDate,
      gst:gst,
      Discount:Discount,
      SafetyFee:SafetyFee,
      time:selectedSlot,
      subTotal:subTotal,
    });
    const saveAppointment = await newAppointment.save();
    res.json(saveAppointment);
  } catch (error) {
    res.status(500).json(error);
    console.log(error)
  }
};

exports.getAppointmentsByUserIdAndStatus = async (req, res) => {
  try {
    const { userId, } = req.params;
   
    // Assuming 'status' is a field in your appointment documents
    const getAppointments = await appointmentData.find({ userId: userId });
    if (getAppointments.length > 0) {
      res.json(getAppointments);
      
    } else {
      res.status(404).json({ error: `No appointments found for userId ${userId} ` });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};



// service center


exports.getAppointmentByServiceCenterId=async(req,res)=>{
  try {
    const {ServiceCenterId} = req.params
    const getAppointments = await appointmentData.find({serviceCenterId:ServiceCenterId});
    const usersDetails=await User.find({_id:getAppointments.map((user)=>user.userId)})
    if (!usersDetails) {
      res.status(404).json({ error: `No appointments data found` });
    }
    res.json(usersDetails);
  } catch (error) {
    res.status(500).json(error);
  }
}


exports.getServiceCenterAppointmnetsByServiceId=async (req, res) => {
  try {
    const { serviceCenterId } = req.params;
    // Convert the input date string to a JavaScript Date object

    
    // Find appointments for the specified service center and date range
    const appointments = await appointmentData.find({serviceCenterId: serviceCenterId});
    if (!appointments) {
      res.json({message:"Data Not Fetching"});
    }

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments by service center and date:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.updateServiceCenterApponitmentStatus=async (req, res) => {
  const{editedStatus}=req.body
      try {
          // Check user's role or permissions to ensure they are allowed to approve requests (e.g., admin role).
          // Find and update the service center request by its ID, setting "approved" to true
          const updateStatus = await appointmentData.findByIdAndUpdate(
            req.params._id,
             {$set:{status:editedStatus}}  ,
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
  }
exports.deleteServiceCenterAppointment=async(req,res)=>{
  try {
    const { appointmentId } = req.params;
    // Assuming 'status' is a field in your appointment documents
    const getAppointments = await appointmentData.findByIdAndRemove(appointmentId );
    if (!getAppointments) {
      res.json({message:"Data no found"})
    }
    res.json(getAppointments)
  } catch (error) {
    res.status(500).json(error);
  }
}




exports.getUserDetailsByAppointmentByServiceCenterId=async(req,res)=>{
  try {
    const {ServiceCenterId} = req.params
    const getAppointments = await appointmentData.find({serviceCenterId:ServiceCenterId});
    const usersDetails=await User.find({_id:getAppointments.map((user)=>user.userId)})
    if (!usersDetails) {
      res.status(404).json({ error: `No appointments data found` });
    }
    res.json(usersDetails);
  } catch (error) {
    res.status(500).json(error);
  }
}
exports.getUserServicesFromAppointment=async(req,res)=>{
  try {
    const { userId} = req.params;
    // Replace the following line with your actual logic to fetch user details
    const serviceData = await appointmentData.find({ userId: userId } );
    
    if (!serviceData) {
      return res.status(404).json({ message: 'No data found for the given ID' });
    }
const dataRome= serviceData.map((eachService)=>eachService)
    res.json(dataRome);
  } catch (error) {
    console.error('Error fetching users details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getUserDetailsByAppointments = async (req, res) => {
  try {
    const { userIds } = req.body;
    // Replace the following line with your actual logic to fetch user details
    const users = await User.find({ userId: { $in: userIds } });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found for the given IDs' });
    }
    // Modify the response based on your User model structure
    const usersDetails = users.map(user => ({
      userId: user.userId,
      name: user.name,
      // Add other user details you want to include
    }));
    res.json(usersDetails);
  } catch (error) {
    console.error('Error fetching users details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}