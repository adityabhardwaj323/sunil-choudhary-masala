const getBaseTemplate = (content) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #EDD9BC; border-radius: 8px; overflow: hidden; color: #1E1A18;">
    <div style="background-color: #B5390A; padding: 20px; text-align: center;">
      <h1 style="color: #FDF6EC; margin: 0; font-family: 'Georgia', serif;">Sunil Choudhary Masala</h1>
    </div>
    <div style="padding: 30px; background-color: #FAFAFA;">
      ${content}
    </div>
    <div style="background-color: #FDF6EC; padding: 20px; text-align: center; font-size: 12px; color: #6B5C4E; border-top: 1px solid #EDD9BC;">
      &copy; ${new Date().getFullYear()} Sunil Choudhary Masala. All rights reserved.<br>
      Shuddhta Hi Hamari Pehchaan Hai
    </div>
  </div>
`;

exports.welcomeEmail = (name) => {
  return getBaseTemplate(`
    <h2 style="color: #1E1A18; margin-top: 0;">Welcome to SCM, ${name}!</h2>
    <p>Thank you for registering with Sunil Choudhary Masala. We're thrilled to have you here.</p>
    <p>Explore our premium quality, authentic spices from Rajasthan, and add the true taste of purity to your meals.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop" style="background-color: #B5390A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Shop Now</a>
    </div>
  `);
};

exports.orderConfirmation = (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.weight}) x${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  return getBaseTemplate(`
    <h2 style="color: #1E1A18; margin-top: 0;">Order Confirmed!</h2>
    <p>Hi ${order.shippingAddress.firstName},</p>
    <p>Thank you for your order! We've received it and are preparing it for shipment.</p>
    
    <div style="background-color: #fff; border: 1px solid #eee; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <h3 style="margin-top: 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Summary (#${order.orderId})</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        ${itemsHtml}
        <tr>
          <td style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
          <td style="padding: 10px; text-align: right;">₹${order.subtotal}</td>
        </tr>
        <tr>
          <td style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
          <td style="padding: 10px; text-align: right;">₹${order.shippingCharge}</td>
        </tr>
        ${order.discount > 0 ? `<tr>
          <td style="padding: 10px; text-align: right; font-weight: bold; color: green;">Discount:</td>
          <td style="padding: 10px; text-align: right; color: green;">-₹${order.discount}</td>
        </tr>` : ''}
        <tr style="background-color: #FDF6EC;">
          <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">Total:</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">₹${order.totalAmount}</td>
        </tr>
      </table>
    </div>
    
    <p><strong>Payment Method:</strong> ${order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}</p>
    <p><strong>Shipping Address:</strong><br>
      ${order.shippingAddress.addressLine1}<br>
      ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
      ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
    </p>
  `);
};

exports.paymentConfirmation = (order, paymentId) => {
  return getBaseTemplate(`
    <h2 style="color: #1E1A18; margin-top: 0;">Payment Successful</h2>
    <p>Hi ${order.shippingAddress.firstName},</p>
    <p>We have successfully received your payment of <strong>₹${order.totalAmount}</strong> for order <strong>#${order.orderId}</strong>.</p>
    <p><strong>Payment Reference:</strong> ${paymentId}</p>
    <p>Your order is currently being processed. You will receive another email when it ships!</p>
  `);
};

exports.orderStatusUpdate = (order, status) => {
  let message = '';
  switch (status) {
    case 'Processing': message = 'Your order is currently being processed.'; break;
    case 'Confirmed': message = 'Your order has been confirmed by our team.'; break;
    case 'Packed': message = 'Your order has been packed and is ready for dispatch.'; break;
    case 'Shipped': message = `Your order has been shipped. ${order.trackingNumber ? `Tracking Number: <strong>${order.trackingNumber}</strong>` : ''}`; break;
    case 'Out for Delivery': message = 'Good news! Your order is out for delivery and will reach you soon.'; break;
    case 'Delivered': message = 'Your order has been successfully delivered. We hope you enjoy the pure flavors of SCM!'; break;
    case 'Cancelled': message = 'Your order has been cancelled.'; break;
    default: message = `Your order status is now: ${status}.`;
  }

  return getBaseTemplate(`
    <h2 style="color: #1E1A18; margin-top: 0;">Order Update: ${status}</h2>
    <p>Hi ${order.shippingAddress.firstName},</p>
    <p>${message}</p>
    <p><strong>Order ID:</strong> #${order.orderId}</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tracking" style="background-color: #B5390A; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Order</a>
    </div>
  `);
};

exports.refundUpdate = (order, status) => {
  let message = '';
  switch (status) {
    case 'Processing': message = 'Your refund is currently being processed by our payment gateway. It may take 5-7 business days to reflect in your account.'; break;
    case 'Refunded': message = 'Your refund has been successfully processed.'; break;
    case 'Failed': message = 'Your refund could not be completed automatically. Our team will review it manually and assist you shortly.'; break;
  }

  return getBaseTemplate(`
    <h2 style="color: #1E1A18; margin-top: 0;">Refund Update</h2>
    <p>Hi ${order.shippingAddress.firstName},</p>
    <p>Regarding your cancelled order <strong>#${order.orderId}</strong>:</p>
    <div style="background-color: #fff; border: 1px solid #eee; border-left: 4px solid #B5390A; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;">${message}</p>
      ${order.refundAmount ? `<p style="margin: 10px 0 0 0;"><strong>Refund Amount:</strong> ₹${order.refundAmount}</p>` : ''}
    </div>
  `);
};
