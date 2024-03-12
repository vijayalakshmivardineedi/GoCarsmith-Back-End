const ManageAddress = require('../../models/user/ManageAddress');
exports.addAddress = async (req,res) => {
    const {locality, Name, FlatNo, pincode, longitude, latitude} = req.body;
    const newAddress = new ManageAddress({
        locality,
        Name,
        FlatNo,
        pincode,
        longitude,
        latitude,
    })
    try{
        const savedAddress = await newAddress.save();
        res.json(savedAddress)
    }catch(err){
        console.error(err);
        res.status(400).json({ error: 'Failed to add the Address', details: err.message });
    }
}