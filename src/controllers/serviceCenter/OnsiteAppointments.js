const User = require('../../models/user/auth');
const moment = require('moment-timezone');

const mongoose=require('mongoose');
const onSiteAppointmentData = require('../../models/serviceCenter/OnsiteAppointments');
const appointmentData = require('../../models/user/appointments');

//service centers

exports.getAppointmentsByDate=async (req, res) => {
    try {
      const { serviceCenterId, date } = req.params;
      // Convert the input date string to a JavaScript Date object
      const inputDate = new Date(date);
      // Get the start and end of the input date
      const startOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      // Find appointments for the specified service center and date range
      const appointments = await appointmentData.find({
        serviceCenterId: mongoose.Types.ObjectId(serviceCenterId),
        appointmentDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });
      if (!appointments) {
        res.json({message:"Data Not Fetching"})
      }
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments by service center and date:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

  exports.getOnsiteAppointmentsByDate=async (req, res) => {

    try {
      const { serviceCenterId, date } = req.params;
      // Convert the input date string to a JavaScript Date object
      const inputDate = new Date(date);
      // Get the start and end of the input date
      const startOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      // Find appointments for the specified service center and date range
      const appointments = await onSiteAppointmentData.find({
        serviceCenterId: serviceCenterId,
        appointmentDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      if (!appointments) {
        res.json({message:"Data Not Fetching"});
      }
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments by service center and date:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  exports.getServiceCenterAppointmnetsByServiceId=async (req, res) => {
    try {
      const { serviceCenterId } = req.params;
      // Convert the input date string to a JavaScript Date object
      // Find appointments for the specified service center and date range
      const appointments = await appointmentData.find({serviceCenterId: serviceCenterId});
      if (!appointments) {
        res.json({message:"Data Not Fetching"})
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


    //onsiteAppointments
    exports.updateServiceCenterOnsiteApponitmentStatus=async (req, res) => {
 
        const{editedStatus}=req.body
        
       
            try {
                // Check user's role or permissions to ensure they are allowed to approve requests (e.g., admin role).
          
                // Find and update the service center request by its ID, setting "approved" to true
                const updateStatus = await onSiteAppointmentData.findByIdAndUpdate(
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
      
      const getAppointments = await appointmentData.findByIdAndRemove(appointmentId );
      if (!getAppointments) {
       res.json({message:"Data no found"})
      } 
      res.json(getAppointments)
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //onsite Appointment 


  exports.deleteServiceCenterOnsiteAppointment=async(req,res)=>{
    try {
      const { appointmentId } = req.params;
      const getAppointments = await onSiteAppointmentData.findByIdAndRemove(appointmentId );
      if (!getAppointments) {
        res.json({message:"No Data Found"})
      } 
      res.json(getAppointments)
    } catch (error) {
      res.status(500).json(error);
    }
  }



  function generateUserId() {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number
  
    // Generate a random number within the specified range
    const randomUserId = Math.floor(Math.random() * (max - min + 1)) + min;
  
    return randomUserId.toString(); // Convert to string
  }
      
  const userId = generateUserId();
  
 
  // Example usage
  
  
  exports.AddAppointmentInServiceCenter = async (req, res) => {
  
  
    try {
  
  
      const {
        carModel,
        Brand,
        imagePath,
        email,
        fuelType,
        serviceCenterId,
        listOfServices,
        paymentMethod,
        timeSlot,
        subTotal,
        gst,
        Discount,
        SafetyFee,
        customerLocation,
        appointmentDate
      } = req.body;
      const newAppointment = new onSiteAppointmentData ({
          userId:userId,
          customerLocation:{
          firstName:customerLocation.firstName,
          lastName:customerLocation.lastName,
          address1:customerLocation.address1,
          address2:customerLocation.address2,
          city:customerLocation.city,
          state:customerLocation.state,
          zip:customerLocation.zip,
          country:customerLocation.country,
          phoneNumber:customerLocation.phoneNumber
  
        }, // Corrected property name
  
        customerName:`${customerLocation.firstName} ${customerLocation.lastName}`,
        contactNumber:customerLocation.phoneNumber,
        paymentMethod:paymentMethod,
        carModel:carModel,
        email:email,
  
        Brand:Brand,
        imagePath:imagePath,
  
        serviceCenterId:serviceCenterId,
        listOfServices:listOfServices,
  
        fuelType:fuelType,
        appointmentDate: appointmentDate,
  
        time:timeSlot,
        subTotal:subTotal,
        gst:gst,
  
        Discount:Discount,
        SafetyFee:SafetyFee
  
      });
      const saveAppointment = await newAppointment.save();
  
      res.json(saveAppointment);
  
    } catch (error) {
  
      res.status(500).json(error);

    }
  };
  
  
  
  
  
  
  
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
  
  
  //CustomerDetails
  
  
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
  
  
  
  exports.getUserServicesFromAppointment=async(req,res)=>{
  
    try {
      const { userId} = req.params;
  
      // Replace the following line with your actual logic to fetch user details
      const serviceData = await appointmentData.find({ userId: userId } )
      
      
      if (!serviceData) {
        return res.status(404).json({ message: 'No data found for the given ID' });
      }
  const dataRome= serviceData.map((eachService)=>eachService.listOfServices)
  
      res.json(dataRome);
  
    } catch (error) {
  
      console.error('Error fetching users details:', error);
      res.status(500).json({ message: 'Internal server error' });
  
    }
  }
  

  //onsiteAppointments
 
  
  
  //dash board
  
  
  exports.getTotalAppointmentByServiceCenterId=async(req,res)=>{

  
    try {
      const {ServiceCenterId} = req.params
      
    
      const getAppointments = await appointmentData.find({serviceCenterId:ServiceCenterId});
  
      if (!getAppointments) {
        res.status(404).json({ error: `No appointments data found` });
      }
      
      res.json(getAppointments);
  
    } catch (error) {
  
      res.status(500).json(error);
  
    }
  }

  //onsiteAppointment


  exports.getTotalOnsiteAppointmentByServiceCenterId=async(req,res)=>{

  
    try {
      const {ServiceCenterId} = req.params
      
    
      const getAppointments = await onSiteAppointmentData.find({serviceCenterId:ServiceCenterId});
  
      if (!getAppointments) {
        res.status(404).json({ error: `No appointments data found` });
      }
      
      
      res.json(getAppointments);
  
    } catch (error) {
  
      res.status(500).json(error);
  
    }
  }


  exports.getAllAppointmentDatesByServiceCenterId = async (req, res) => {
    try {
      const { ServiceCenterId } = req.params;
  
      // Find all appointments for the given serviceCenterId
      const getAppointments = await appointmentData.find({ serviceCenterId: ServiceCenterId });
  
      if (!getAppointments || getAppointments.length === 0) {
        res.status(404).json({ error: 'No appointments found for the specified service center' });
        return;
      }
  
      // Extracting relevant appointment details
      const appointmentDetails = getAppointments.map(appointment => ({
        appointmentDate: appointment.appointmentDate,
        Date: appointment.Date,
        time: appointment.time,
      }));
  
      // Respond with the appointment details
      res.json(appointmentDetails);
    } catch (error) {
      res.status(500).json(error);
    }
  };

// DashBoard Backend

  exports.TotalOnsiteAppointment=async(req,res)=>{

    try {
     
      const getAppointments = await onSiteAppointmentData.find();
  
      if (!getAppointments) {
        res.status(404).json({ error: `No appointments data found` });
      }
      
      
      res.json(getAppointments);
  
    } catch (error) {
  
      res.status(500).json(error);
  
    }
  }
  exports.getTotalOnsiteAppointments = async (req, res) => {
    try {
      const getAppointments = await onSiteAppointmentData.find();
  
      // Extract unique customer names from getAppointments using a Set
      const uniqueCustomerNames = [...new Set(getAppointments.map((user) => user.customerName))];
  
      if (!uniqueCustomerNames || uniqueCustomerNames.length === 0) {
        return res.status(404).json({ error: "No appointments data found" });
      }
  
      return res.json(uniqueCustomerNames);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json(error);
    }
  };
  
  
  exports.TotalAppointments=async(req,res)=>{

    try {
      
      const getAppointments = await appointmentData.find();
  
      if (!getAppointments) {
        res.status(404).json({ error: `No appointments data found` });
      }
      
      res.json(getAppointments);
  
    } catch (error) {
  
      res.status(500).json(error);
  
    }
  }


  exports.getOnsiteAppointmentsById=async(req,res)=>{
    const {appointmentId}=req.params
    try {
      const getAppointments = await onSiteAppointmentData.find({_id:appointmentId});
      if (!getAppointments) {
        res.status(404).json({ error: `No appointments data found` });
      }
      res.json(getAppointments);
    } catch (error) {
      res.status(500).json(error);
    }
  }