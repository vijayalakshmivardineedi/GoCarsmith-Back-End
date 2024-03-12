const mongoose = require('mongoose')
const AppointmentModel = require("../../models/user/appointments");
const onSiteAppointmentData = require('../../models/serviceCenter/OnsiteAppointments');

//add appointment


//get appointment by id

exports.getAppointmentBookingById = async (req, res) => {

  try {
    const appointmentId = req.params;
    const getData = await AppointmentModel.fi

    ndById(appointmentId)
    res.json(getData);

  } catch (error) {
    res.status(500).json(error)
  }
}


//get appointmen's

exports.getAppointmentBooking = async (req, res) => {

  try {

    const getData = await AppointmentModel.find()
    res.json(getData);

  } catch (error) {
    res.status(500).json(error)
  }
}



//update appointment status


exports.updateApponitmentStatus = async (req, res) => {

  const GetiD = await AppointmentModel.findByIdAndUpdate(req.params._id,)

  if (GetiD.status === "Pending") {
    try {
      // Check user's role or permissions to ensure they are allowed to approve requests (e.g., admin role).

      // Find and update the service center request by its ID, setting "approved" to true
      const updateStatus = await AppointmentModel.findByIdAndUpdate(
        req.params._id,
        { status: "Approved" },
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

  } else {
    return res.json({ msg: "Status Already Updated" })
  }
}


exports.CancelAppointment = async (req, res) => {

  const GetiD = await AppointmentModel.findByIdAndUpdate(req.params._id,)

  if (GetiD.status === "Pending" || GetiD.status === "Approved") {
    try {
      // Check user's role or permissions to ensure they are allowed to approve requests (e.g., admin role).

      // Find and update the service center request by its ID, setting "approved" to true
      const updateStatus = await AppointmentModel.findByIdAndUpdate(
        req.params._id,
        { status: "Cancelled" },
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

  } else {
    return res.json({ msg: "Status Already Updated" })
  }


}



exports.completedAppointment = async (req, res) => {

  const GetiD = await AppointmentModel.findByIdAndUpdate(req.params._id,)

  if (GetiD.status === "Approved") {
    try {
      // Check user's role or permissions to ensure they are allowed to approve requests (e.g., admin role).

      // Find and update the service center request by its ID, setting "approved" to true
      const updateStatus = await AppointmentModel.findByIdAndUpdate(
        req.params._id,
        { status: "Completed" },
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

  } else {
    return res.json({ msg: "Appointment not accepted" })
  }


}



// update data for appaointment reschedule



exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate and update the appointment
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true } // Return the updated document
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.getServicesHistoryByStatus = async (req, res) => {

  const getDataStatus = await AppointmentModel.find({ status: 'Completed' })

  if (!getDataStatus) {

    return res.status(404).json({ message: 'Appointment not found' });

  }

  res.json(getDataStatus)

}


exports.getOnsiteAppointmentsForAdmin = async (req, res) => {
  try {
    // Validate and update the appointment
    const updatedAppointment = await onSiteAppointmentData.find();
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}