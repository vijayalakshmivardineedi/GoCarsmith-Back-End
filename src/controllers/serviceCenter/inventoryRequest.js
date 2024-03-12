const InventoryRequestModel = require("../../models/serviceCenter/inventoryRequest");
const { sendEmail } = require('../../validator/email');


exports.sendInventoryRequest=async (req, res) => {
    try {
      // Extract request data from the request body
      const { serviceCenterId, items, email } = req.body;
    
      // Create a new inventory request
      const newRequest = new InventoryRequestModel ({
        serviceCenterId,
        items,
      });
      // Save the request to the database
      const savedRequest = await newRequest.save();
      res.json(savedRequest);
      sendEmail(
        email,
        'Inventory Order',
        `Hi ${serviceCenterId},\nWelcome to GoCarsmith.\nYour Order of \n${items} \nhas been successfully submitted.`
      );
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }


  exports.getInventoryRequest = async (req, res) => {
    try {
      const { serviceCenterId } = req.params;
      const inventoryRequests = await InventoryRequestModel.find({
        serviceCenterId: serviceCenterId
      });
      res.json(inventoryRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  exports.deleteRequestById=async(req,res)=>{
    const requestId = req.params.requestId;
    try {
      const editdata = await InventoryRequestModel.findByIdAndDelete(requestId);
      if (!editdata) {
        return res.status(404).json({ message: "Data not found" });
      }
      res.json(editdata);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  exports.updateInventoryRequest = async (req, res) => {
    try {
      // Extract request data from the request body
      const { serviceCenterId, items: newItems } = req.body;
      const requestId = req.params.requestId;
      // Check if the inventory request exists
      const existingRequest = await InventoryRequestModel.findById(requestId);
      if (!existingRequest) {
        return res.status(404).json({ message: 'Inventory request not found' });
      }
      // Update service center id and replace existing items with new items
      existingRequest.serviceCenterId = serviceCenterId;
      existingRequest.items = newItems;
      // Save the updated request to the database
      const updatedRequest = await existingRequest.save();
      // Only send the new items in the response
      const { _id, serviceCenterId: updatedServiceCenterId, items: updatedItemsOnly } = updatedRequest;
      res.json({ _id, serviceCenterId: updatedServiceCenterId, items: updatedItemsOnly });
    } catch (error) {
      console.error('Error updating Request data:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };




  exports.getAllRequestsFromDataBase=async (req,res)=>{
    try{
      const getdetails=await InventoryRequestModel.find()
      if(!getdetails){
        return res.status(404).json({message:"Data not found"})
      }
      res.json(getdetails)
    }catch{
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  exports.editStatusOfInventoryRequestApproveOrRejected = async (req, res) => {
    const { status } = req.body;
    const requestId = req.params.requestId;
  
    try {
      const editdata = await InventoryRequestModel.findByIdAndUpdate(requestId, { status: status }, { new: true });
  
      if (!editdata) {
        return res.status(404).json({ message: "Data not found" });
      }
  
      res.json(editdata);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  
  exports.getRequestsByStatus = async (req, res) => {
    try {
      // Extract status from the URL parameters
      const { status } = req.params;
  
      // Validate that status is provided
      if (!status) {
        return res.status(400).json({ message: "Status is required in the URL parameters" });
      }
  
      // Check if the provided status is valid (e.g., "Pending", "Granted", "Rejected")
      const validStatusValues = ["Pending", "Granted", "Rejected"];
      if (!validStatusValues.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
  
      // Find inventory requests based on the specified status
      const requestsByStatus = await InventoryRequestModel.find({ status: status });
  
      if (requestsByStatus.length === 0) {
        return res.status(404).json({ message: `No requests found with status: ${status}` });
      }
  
      res.json(requestsByStatus);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  
  exports.approveInventoryRequest=async (req, res) => {
    
    const updated = await InventoryRequestModel.findByIdAndUpdate(req.params._id)
   
    try {
      // Check user's role or permissions to ensure they are allowed to approve requests (e.g., admin role).
      if(updated.status==="Pending"){

        const updatedRequest = await InventoryRequestModel.findByIdAndUpdate(
          req.params._id,
          { status: "Granted" },
          { new: true} // Return the updated document
        );
  
        if (!updatedRequest) {
          return res.status(404).json({ message: 'Service center request not found' });
        }
    
        res.json(updatedRequest);
       

      }else{
        return res.status(200).json({message:"no requests"})
      }
      // Find and update the service center request by its ID, setting "approved" to true
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
  exports.rejectInventoryRequest=async (req, res) => {
    
    const updated = await InventoryRequestModel.findByIdAndUpdate(req.params._id)
  
  
    try {
      // Check user's role or permissions to ensure they are allowed to approve requests (e.g., admin role).
      if(updated.status==="Pending"){

        const updatedRequest = await InventoryRequestModel.findByIdAndUpdate(
          req.params._id,
          { status: "Rejected" },
          { new: true} // Return the updated document
        );
  
        if (!updatedRequest) {
          return res.status(404).json({ message: 'Service center request not found' });
        }
    
        res.json(updatedRequest);
       

      }else{

        return res.status(200).json({message:"no requests"})

      }
      // Find and update the service center request by its ID, setting "approved" to true
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }