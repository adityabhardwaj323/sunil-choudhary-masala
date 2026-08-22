const fs = require('fs');
const file = 'controllers/orderController.js';
let code = fs.readFileSync(file, 'utf8');

const replacement = `  // 7. Apply coupon/discount if provided
  let discount = 0;
  let validatedCouponCode = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon && coupon.isActive) {
      if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
        return { error: 'This coupon has expired', status: 400 };
      } else if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return { error: 'This coupon has reached its usage limit', status: 400 };
      } else if (subtotal < coupon.minOrderValue) {
        return { error: \`Minimum order value of ₹\${coupon.minOrderValue} required\`, status: 400 };
      } else {
        if (coupon.isFirstOrderOnly) {
          const previousOrderCount = await Order.countDocuments({ user: userId, paymentStatus: { $ne: 'Failed' } });
          if (previousOrderCount > 0) {
            return { error: 'This first-order offer is only available to new customers.', status: 400 };
          }
        }
        // Calculate discount
        discount = Math.round(subtotal * coupon.discountPercent / 100);
        if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
          discount = coupon.maxDiscountAmount;
        }
        validatedCouponCode = coupon.code;
      }
    } else {
      return { error: 'Invalid or inactive coupon code', status: 400 };
    }
  }`;

code = code.replace(
    /\/\/ 7\. Apply coupon\/discount if provided[\s\S]*?discount = coupon\.maxDiscountAmount;\n\s*\}\n\s*validatedCouponCode = coupon\.code;\n\s*\}\n\s*\}\n\s*\}/m,
    replacement
);

fs.writeFileSync(file, code);
console.log('Fixed orderController.js');
