const mongoose=require('mongoose');

const referralSchema = new mongoose.Schema({

    code: { type: String, unique: true },

    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Referral' }]
    
  });
  
  const Referral = mongoose.model('Referral', referralSchema);
  
  module.exports=Referral
  