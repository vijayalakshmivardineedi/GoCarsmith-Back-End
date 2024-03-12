
const express = require('express');
const router = express.Router();
const Referral = require('../../models/user/Referral');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(router);
const io = socketIo(server);


const generateReferralCode = () => {
  const timestamp = new Date().getTime().toString(36);
  const randomComponent = Math.random().toString(36).substr(2, 5);
  const referralCode = timestamp + randomComponent;
  return referralCode;
};

router.post('/generateReferralCode', async (req, res) => {
  
  try {

    let referralCode; 
    let isCodeUnique = false;

    // Keep generating a new code until it is unique

    while (!isCodeUnique) {

      referralCode = generateReferralCode();

      try {

        // Attempt to update with the new code
        const updatedReferral = await Referral.findByIdAndUpdate(

          req.body.referralId,
          { code: referralCode },
          { new: true }

        );
        // If successful, set isCodeUnique to true to exit the loop

        isCodeUnique = true;

      } catch (error) {

        // If a duplicate key error occurs, generate a new code in the next iteration

        if (error.code === 11000) {

          console.log('Duplicate key error. Regenerating code.');

        } else {

          throw error;
          
        }
      }
    }

    res.json({ referralCode });
    io.emit('referralCodeGenerated', referralCode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('generateReferralCode', ({ referralCode }) => {
    // Handle the referral code, for example, save it to a database
    console.log('Received generated referral code:', referralCode);

    // Broadcast the generated code to all connected clients
    io.emit('referralCodeGenerated', referralCode);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

  module.exports=router