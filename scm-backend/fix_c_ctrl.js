const fs = require('fs');
const file = 'controllers/couponController.js';
let code = fs.readFileSync(file, 'utf8');

// I need to add Order model
if (!code.includes("const Order = require('../models/Order');")) {
    code = code.replace(
        "const Coupon = require('../models/Coupon');",
        "const Coupon = require('../models/Coupon');\nconst Order = require('../models/Order');"
    );
}

// In validateCoupon:
const replacement = `
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });

    if (coupon.isFirstOrderOnly) {
      if (!req.user) {
        return res.status(401).json({ message: 'Please login to use this first-order offer' });
      }
      const previousOrders = await Order.countDocuments({ user: req.user._id, paymentStatus: { $ne: 'Failed' } });
      if (previousOrders > 0) {
        return res.status(400).json({ message: 'This first-order offer is only available to new customers.' });
      }
    }

    let discount = (orderValue * coupon.discountPercent) / 100;
`;
code = code.replace(
    /if \(coupon\.usageLimit && coupon\.usedCount >= coupon\.usageLimit\)[\s\S]*?let discount = \(orderValue \* coupon\.discountPercent\) \/ 100;/m,
    replacement.trim()
);

fs.writeFileSync(file, code);
console.log('Fixed couponController.js');
