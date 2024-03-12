const healthCardModel = require("../../models/user/HealthInsurance");

exports.createHealthInsuranceForCustomer = async (req, res) => {
  let CoverPhoto = '';
  if (req.file) {
    CoverPhoto = `/public/${req.file.filename}`;
  }

  try {
    const {
      userId,
      holderName,
      address,
      DOB,
      gender,
      insuranceCompany,
      policyPlan,
      contactNumber
      // planCost
    } = req.body;

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 5);

    // Function to generate a unique policy number
    const generateUniquePolicyNumber = () => {
      const randomNum = Math.floor(Math.random() * (9999999999 - 10000000 + 1) + 10000000);
      return `${randomNum}`;
    };

    let uniquePolicyNumber;
    let attempts = 0;

    // Ensure uniqueness of policy number
    while (!uniquePolicyNumber && attempts < 1000) {
      const candidatePolicyNumber = generateUniquePolicyNumber();

      const existingPolicy = await healthCardModel.findOne({ policyNumber: candidatePolicyNumber });

      if (!existingPolicy) {
        uniquePolicyNumber = candidatePolicyNumber;
      }

      attempts++;
    }

    if (!uniquePolicyNumber) {
      throw new Error("Unable to generate a unique policy number after maximum attempts.");
    }

    const createHealthCard = new healthCardModel({
      userId: userId,
      holderName: holderName,
      address: address,
      DOB: DOB,
      gender: gender,
      CoverPhoto:CoverPhoto,
      insuranceCompany: insuranceCompany,
      policyNumber: uniquePolicyNumber,
      expiryDate: expiryDate,
      policyPlan: policyPlan,
      contactNumber: contactNumber
      // planCost: planCost
    });

    const savedData = await createHealthCard.save();
    res.json(savedData);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to add the health insurance', details: error.message });
  }
};



exports.getHealthCardDetailsByUsingUserId=async(req,res)=>{
    const {userId}=req.params
    
    try {
       const gettingData=await healthCardModel.findOne({userId})
       if(!gettingData){
        res.json({message:'data not getting'})
       }
        res.json(gettingData)
     
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to add the health insurance', details: error.message });
      }
}