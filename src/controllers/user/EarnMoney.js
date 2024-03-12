const moneyEarn = require("../../models/user/EarnMoney");

exports.earnMoneyByReferal = async (req, res) => {
    const { userId, money } = req.body;
    try {
        // Check if the user already has a referral entry
        const existingReferral = await moneyEarn.findOne({ userId });
    
        if (existingReferral) {
          // User already has a referral, update the total money
          existingReferral.totalMoney += money;
          await existingReferral.save();
        } else {
          // User doesn't have a referral, create a new entry
          const newReferral = new moneyEarn({
            userId,
            moneyReferal: money,
            referalDate: new Date(),
            expiryDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Set the expiry date 30 days from the referalDate
            totalMoney: money,
          });
          await newReferral.save();
        }
    
        // You can return additional information or success status if needed
        return res.status(200).json({ success: true, message: 'Referral processed successfully.' });
      } catch (error) {
        console.error('Error handling referral:', error);
        return res.status(500).json({ success: false, message: 'Error processing referral.' });
      }
}


exports.getReferalDetails=async(req,res)=>{
    const { userId} = req.params
    try {
        const getReferalData=await moneyEarn.find({userId:userId})
        res.json(getReferalData)
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to add the brand', details: err.message });
    }
}






  


 



