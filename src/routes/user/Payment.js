const express=require("express");
const router=express.Router();
const crypto =  require('crypto');
const axios = require('axios');

const salt_key="099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
 const merchant_id="PGTESTPAYUAT"


 const generateTrancationId=()=>{
    const timeStamp=Date.now();
    const randomNum=Math.floor(Math.random())
    const merchantPreFix="T";
    const transactID=`${merchantPreFix}${timeStamp}${randomNum}`
    return transactID
  }
  router.post('/payment', async (req, res) => {
    const{
     name,
     amount,number}=req.body
    try {
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: generateTrancationId(),
            merchantUserId: 'MUID9EFW8E9F89EWF8C',
            name: name,
            amount:amount*100,
            
            redirectUrl: `${process.env.API}/api/status`,
            redirectMode: 'POST',
            mobileNumber: number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };
        axios
        .request(options)
        .then((response)=> {
            // return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
            return res.status(200).send(response.data.data.instrumentResponse.redirectInfo.url)
          })
        .catch(
          (error) =>{
         
            console.error(error.response.data);
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
  })
router.post('/status',  async(req, res) => {
  const merchantTransactionId = res.req.body.transactionId
  const merchantId = res.req.body.merchantId
  const keyIndex = 1;
  const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + "###" + keyIndex;
  const options = {
  method: 'GET',
  url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
  headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': merchantId
  }
  };
  // CHECK PAYMENT TATUS
  axios.request(options).then(async(response) => {
      if (response.data.success === true) {
          const url = `https://gocarsmith.netlify.app/success`
          return res.redirect(url)
      } else {
          const url = `https://gocarsmith.netlify.app/`
          return res.redirect(url)
      }
  })
  .catch((error) => {
      console.error(error.response.data);
  });
  
});
module.exports=router;