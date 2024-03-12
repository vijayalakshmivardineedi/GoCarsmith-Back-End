const Coupon = require('../../models/admin/coupons');


// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const {Title, code, description, discountType,Date, discountValue, expiryDate, isActive } = req.body;

    // Generate a unique code

    const coupon = new Coupon({
      Title,
      code,
      description,
      discountType,
      discountValue,
      Date,
      expiryDate,
      isActive,
    });

    const savedCoupon = await coupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    console.error("Error while creating coupon:", error);
    res.status(500).json({ error: 'Failed to create a coupon.' });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    // Fetch all coupons from the database
    const coupons = await Coupon.find();

    res.status(200).json(coupons);
  } catch (error) {
    console.error('Error while fetching coupons:', error);
    res.status(500).json({ error: 'Failed to fetch coupons.' });
  }
};


exports.deleteCoupon= async (req, res) => {
  try {
      const couponId = req.params.id;
      
      // Find and delete the car model by ID
      await Coupon.findByIdAndDelete(couponId);
      res.json({ success: true, message: 'Coupon Deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Could not delete Coupon.' });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode, totalAmount } = req.body;

    // Find the coupon in the database
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'Coupon is not active' });
    }

    // Check if the coupon has expired
    const currentDate = new Date();
    if (coupon.expiryDate < currentDate) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    // Apply the discount based on the discount type (e.g., percentage or fixed value)
    let discountedAmount = totalAmount;

    if (coupon.discountType === 'percentage') {
      discountedAmount = totalAmount * (1 - coupon.discountValue / 100);
    } else if (coupon.discountType === 'fixed') {
      discountedAmount = totalAmount - coupon.discountValue;
    }

    res.status(200).json({ discountedAmount });
  } catch (error) {
    console.error("Error while applying coupon:", error);
    res.status(500).json({ error: 'Failed to apply the coupon.' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;
    const updatedData = req.body;

    // Find and update the coupon by ID
    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updatedData, { new: true });

    if (!updatedCoupon) {
      return res.status(404).json({ success: false, error: 'Coupon not found' });
    }

    res.json({ success: true, data: updatedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Could not update coupon.' });
  }
};