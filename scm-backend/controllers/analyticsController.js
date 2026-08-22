// controllers/analyticsController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @route   GET /api/analytics
// @desc    Get admin analytics dashboard data
// @access  Admin Only
const getAnalytics = async (req, res) => {
  try {
    const { range, startDate, endDate } = req.query;
    
    // Determine date range filter
    let dateFilter = {};
    const now = new Date();
    let start = new Date(0); // default to beginning of time
    let end = now;

    if (range === 'today') {
      start = new Date(now.setHours(0, 0, 0, 0));
    } else if (range === 'last7days') {
      start = new Date(now.setDate(now.getDate() - 7));
    } else if (range === 'last30days') {
      start = new Date(now.setDate(now.getDate() - 30));
    } else if (range === 'thismonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      // Validate custom dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Invalid custom date range' });
      }
      end.setHours(23, 59, 59, 999);
    }

    if (range && range !== 'all') {
      dateFilter.createdAt = { $gte: start, $lte: end };
    }

    // 1. Total Customers (registered in this period)
    const totalCustomers = await User.countDocuments({ role: 'customer', ...dateFilter });

    // 2. Total Products (active products)
    const totalProducts = await Product.countDocuments({ isActive: true });

    // 3. Order Aggregations
    // We only count revenue from orders that are NOT cancelled
    const orders = await Order.find(dateFilter);
    
    let totalOrders = 0;
    let totalRevenue = 0;
    let cancelledOrders = 0;
    let refundCount = 0;
    let refundTotal = 0;
    let codOrderCount = 0;
    let codRevenue = 0;
    let razorpayOrderCount = 0;
    let razorpayRevenue = 0;
    
    const ordersByStatus = {};
    const revenueByDate = {};
    const ordersByDate = {};

    orders.forEach(order => {
      totalOrders++;
      
      // Date aggregation for charts
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (!ordersByDate[dateStr]) ordersByDate[dateStr] = 0;
      ordersByDate[dateStr]++;
      
      if (!ordersByStatus[order.orderStatus]) ordersByStatus[order.orderStatus] = 0;
      ordersByStatus[order.orderStatus]++;

      if (order.orderStatus === 'Cancelled') {
        cancelledOrders++;
        
        // Handle Refunds
        if (order.refundAmount && order.refundStatus === 'Refunded') {
          refundCount++;
          refundTotal += order.refundAmount;
        }
      } else {
        // Valid Revenue Order
        totalRevenue += order.totalAmount;
        
        if (!revenueByDate[dateStr]) revenueByDate[dateStr] = 0;
        revenueByDate[dateStr] += order.totalAmount;

        if (order.paymentMethod === 'COD') {
          codOrderCount++;
          codRevenue += order.totalAmount;
        } else {
          razorpayOrderCount++;
          razorpayRevenue += order.totalAmount;
        }
      }
    });

    const averageOrderValue = (totalOrders - cancelledOrders) > 0 ? (totalRevenue / (totalOrders - cancelledOrders)) : 0;

    // 4. Top Selling Products
    const topProducts = await Product.find({ isActive: true })
      .sort({ totalSold: -1 })
      .limit(5)
      .select('name totalSold images');

    // 5. Low Stock Variants (less than 10 items)
    const lowStockThreshold = 10;
    const allProducts = await Product.find({ isActive: true }).select('name variants');
    const lowStockItems = [];
    allProducts.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock <= lowStockThreshold) {
          lowStockItems.push({
            productId: p._id,
            name: p.name,
            weight: v.weight,
            stock: v.stock,
            isOutOfStock: v.stock === 0
          });
        }
      });
    });
    
    // Sort so out of stock is first, then by lowest stock
    lowStockItems.sort((a, b) => a.stock - b.stock);

    res.json({
      summary: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalProducts,
        averageOrderValue,
        cancelledOrders,
        refundCount,
        refundTotal,
        codOrderCount,
        codRevenue,
        razorpayOrderCount,
        razorpayRevenue
      },
      charts: {
        ordersByStatus,
        revenueByDate,
        ordersByDate
      },
      topProducts,
      lowStockItems: lowStockItems.slice(0, 10) // top 10 lowest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAnalytics };
