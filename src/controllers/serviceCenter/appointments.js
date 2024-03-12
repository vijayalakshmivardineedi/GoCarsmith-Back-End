exports.getAppointmentBookingById=async(req,res)=>{
  
    try{
        const appointmentId=req.params;
        const getData=await AppointmentModel.fi
        
        ndById(appointmentId)
        res.json(getData);

    }catch(error){
        res.status(500).json(error)
    }
}