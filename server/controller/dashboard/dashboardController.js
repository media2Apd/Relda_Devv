const userModel = require("../../models/userModel");
const productModel = require("../../models/productModel");
const orderModel = require("../../models/orderProductModel");
const CookieAcceptance = require("../../models/CookieAcceptance");
const ProductCategory = require("../../models/productCategory");
const addToCartModel = require("../../models/cartProduct")
const moment = require('moment');
// Function to get the financial year's start date
function getFinancialYearStartDate() {
  const currentDate = new Date();
  let startYear = currentDate.getFullYear();
  if (currentDate.getMonth() < 3) {
    // Before April
    startYear -= 1;
  }
  return new Date(startYear, 3, 1); // April 1st
}

// Helper function for MTD filter
function getMTDFilter(startDate, endDate) {
  const startOfMonth = startDate
    ? new Date(startDate)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = endDate
    ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999))
    : new Date();
  return {
    createdAt: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  };
}


// function calculatePercentage(current, previous) {
//   if (previous === 0) return current > 0 ? 100 : 0;
//   return ((current - previous) / previous) * 100;
// }

function calculatePercentage(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  const percentage = ((current - previous) / previous) * 100;
  return percentage;
}


function getTrend(percentage) {
  return percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral";
}

function getStatics(trend, comparisonPeriod) {
  switch (trend) {
    case "up":
      return `Up from ${comparisonPeriod}`;
    case "down":
      return `Down from ${comparisonPeriod}`;
    default:
      return `No change from ${comparisonPeriod}`;
  }
}

const currentDayFilter = {
  createdAt: {
    $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
    $lt: new Date(new Date().setHours(23, 59, 59, 999)), // End of today
  },
};


const previousDayFilter = {
  createdAt: {
    $gte: moment().subtract(1, 'days').startOf('day').toDate(),
    $lt: moment().subtract(1, 'days').endOf('day').toDate(),
  },
};

const previousMonthFilter = {
  createdAt: {
    $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), // Start of previous month
    $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
  },
};

const previousYearFilter = {
  createdAt: {
    $gte: new Date(new Date().getFullYear() - 1, 3, 1), // Start of previous financial year
    $lt: getFinancialYearStartDate(), // Start of current financial year
  },
};

// Helper function for YTD filter
function getYTDFilter(startDate, endDate) {
  const financialYearStart = getFinancialYearStartDate();
  const financialYearEnd = new Date(
    new Date(financialYearStart).setFullYear(
      financialYearStart.getFullYear() + 1
    )
  );
  const ytdStart = startDate ? new Date(startDate) : financialYearStart;
  const ytdEnd = endDate
    ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999))
    : financialYearEnd;
  return {
    createdAt: {
      $gte: ytdStart,
      $lte: ytdEnd,
    },
  };
}

exports.getDashboardCounts = async (req, res) => {
  const { startDate, endDate, category } = req.query;

  try {
    
    // General date range filter
    const dateFilter =
      startDate && endDate
        ? {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)),
          },
        }
        : {};

    // Category filter for products within orders
    const categoryFilter = category ? { category } : {};

    const categoryCountFilter = category ? { value: category } : {};

    const categoryFilterOrders = category
      ? {
        productDetails: { $elemMatch: { category } },
      }
      : {};

    const mtdFilter = getMTDFilter(startDate, endDate);
    const ytdFilter = getYTDFilter(startDate, endDate);

    // Fetch general counts
    const userCount = await userModel.countDocuments(dateFilter);
    const productCount = await productModel.countDocuments({ ...categoryFilter });
    const categoryCount = await ProductCategory.countDocuments(categoryCountFilter);
    const cartCount = await addToCartModel.countDocuments({ ...dateFilter, ...categoryFilter })
    const orderCount = await orderModel.countDocuments({
      ...dateFilter,
      ...categoryFilterOrders,
      order_status: { $ne: "Pending" }
    });

    // Calculate product stock for the specified category
    const products = await productModel.find({ ...categoryFilter }, 'availability').lean();
    const productStock = products.reduce(
      (total, product) => total + (product.availability || 0),
      0
    );

    // Calculate visitors
    const visitors = await CookieAcceptance.find({}, 'acceptanceTimestamps').lean();
    const totalVisitor = visitors.reduce((count, doc) => {
      const filteredTimestamps = doc.acceptanceTimestamps.filter((timestamp) => {
        const date = new Date(timestamp);
        const startDateUTC = startDate
          ? new Date(startDate).setUTCHours(0, 0, 0, 0)
          : null;
        const endDateUTC = endDate
          ? new Date(endDate).setUTCHours(23, 59, 59, 999)
          : null;
        return (!startDateUTC || date >= startDateUTC) && (!endDateUTC || date <= endDateUTC);
      });
      return count + filteredTimestamps.length;
    }, 0);

    // month wise counts
    const mtdUsers = await userModel.countDocuments(mtdFilter);
    const mtdOrders = await orderModel.countDocuments({ ...mtdFilter, ...categoryFilterOrders ,order_status: { $ne: "Pending" } });
    const mtdVisitors = visitors.reduce((count, doc) => {
      const startOfMonth = mtdFilter.createdAt.$gte;
      return count + doc.acceptanceTimestamps.filter((timestamp) => {
        const date = new Date(timestamp);
        return date >= startOfMonth && date <= mtdFilter.createdAt.$lte;
      }).length;
    }, 0);

    // Year wise Counts
    const ytdUsers = await userModel.countDocuments(ytdFilter);
    const ytdOrders = await orderModel.countDocuments({ ...ytdFilter, ...categoryFilterOrders, order_status: { $ne: "Pending" } });

    const ytdVisitors = visitors.reduce((count, doc) => {
      const ytdStart = ytdFilter.createdAt.$gte;
      return count + doc.acceptanceTimestamps.filter((timestamp) => {
        const date = new Date(timestamp);
        return date >= ytdStart && date <= ytdFilter.createdAt.$lte;
      }).length;
    }, 0);

    let salesAmount = 0;
    let returnSalesAmount = 0;
    let cancelSalesAmount = 0;
    let damageSalesAmount = 0;

    let mtdSalesAmount = 0;
    let ytdSalesAmount = 0;

    let totalSalesAmount = 0;
    let totalMtdSalesAmount = 0;
    let totalYtdSalesAmount = 0;

    const statusCounts = {
      pending: 0,
      ordered: 0,
      packaged: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returnRequested: 0,
      returnAccepted: 0,
      returned: 0,
    };

    const ytdStatusCounts = { ...statusCounts, };
    const mtdStatusCounts = { ...statusCounts, };

    // Fetch orders and calculate statuses
    const orders = await orderModel.find({ ...dateFilter, ...categoryFilterOrders, }).lean();

    orders.forEach((order) => {
      const { statusUpdates, productDetails, order_status } = order;

    // Update Pending Status Count
    if (order_status === 'Pending') {
        statusCounts.pending++;
    }

      const latestStatus = statusUpdates?.at(-1)?.status || 'pending';

      // If a category is selected, filter the products based on that category
      const categoryProducts = productDetails.filter(
        (product) => !category || product.category === category
      );

      // Skip this order if no products match the selected category
      if (!categoryProducts.length) return;

      // Product Status counts
      if (latestStatus && statusCounts.hasOwnProperty(latestStatus)) {
        statusCounts[latestStatus]++;
      }

      if (ytdFilter.createdAt.$gte <= new Date(order.createdAt) && ytdFilter.createdAt.$lte >= new Date(order.createdAt)) {
        if (latestStatus && ytdStatusCounts.hasOwnProperty(latestStatus)) {
          ytdStatusCounts[latestStatus]++;
        }
      }

      if (mtdFilter.createdAt.$gte <= new Date(order.createdAt) && mtdFilter.createdAt.$lte >= new Date(order.createdAt)) {
        if (latestStatus && mtdStatusCounts.hasOwnProperty(latestStatus)) {
          mtdStatusCounts[latestStatus]++;
        }
      }

      // Calculate the total amount for the selected category products only
      const categoryTotalAmount = categoryProducts.reduce(
        (sum, product) => sum + (product.sellingPrice || 0) * product.quantity,
        0
      );

      // Total Sales Calculations and Skip sales calculations for orders with 'Pending' status
      if (order_status !== 'Pending') {

        salesAmount += categoryTotalAmount;
        if (new Date(order.createdAt) >= mtdFilter.createdAt.$gte && new Date(order.createdAt) <= mtdFilter.createdAt.$lte) {
          mtdSalesAmount += categoryTotalAmount;
        }
        if (new Date(order.createdAt) >= ytdFilter.createdAt.$gte && new Date(order.createdAt) <= ytdFilter.createdAt.$lte) {
          ytdSalesAmount += categoryTotalAmount;
        }
      }

      // Return Sales Calculations
      if (latestStatus === 'returned') {
        damageSalesAmount += categoryTotalAmount;
      } 

      // Canceled and Damaged Orders
      if (latestStatus === 'cancelled') {
        cancelSalesAmount += categoryTotalAmount;
      }

      returnSalesAmount = damageSalesAmount + cancelSalesAmount

      totalSalesAmount = salesAmount - returnSalesAmount

      totalMtdSalesAmount = salesAmount - returnSalesAmount

      totalYtdSalesAmount = salesAmount - returnSalesAmount

    });


    // Total Sales Amount percentage, trends, statics
    const [todayOrders, prevDayOrders, prevMonthOrders, prevYearOrders] = await Promise.all([
      orderModel.find({ ...currentDayFilter, ...categoryFilterOrders, "paymentDetails.payment_status": "success" }),
      orderModel.find({ ...previousDayFilter, ...categoryFilterOrders, "paymentDetails.payment_status": "success" }),
      orderModel.find({ ...previousMonthFilter, ...categoryFilterOrders, "paymentDetails.payment_status": "success" }),
      orderModel.find({ ...previousYearFilter, ...categoryFilterOrders, "paymentDetails.payment_status": "success" }),
    ]);



    // Calculate sales
    const calculateSales = (orders) => {
      return orders.reduce(
        (sum, order) =>
          sum +
          order.productDetails.reduce(
            (productSum, product) =>
              productSum + (product.sellingPrice || 0) * product.quantity,
            0
          ),
        0
      );
    };

    const todaySales = calculateSales(todayOrders || []);
    
    const prevDaySales = calculateSales(prevDayOrders || []);
    
    
    const prevMonthSales = calculateSales(prevMonthOrders);
    const prevYearSales = calculateSales(prevYearOrders);

    // Calculate percentages and trends
    const salesPercentage = calculatePercentage(todaySales, prevDaySales);
    
    const mtdPercentage = calculatePercentage(totalMtdSalesAmount, prevMonthSales);
    const ytdPercentage = calculatePercentage(totalYtdSalesAmount, prevYearSales);

    const salesTrend = getTrend(salesPercentage);
    const mtdTrend = getTrend(mtdPercentage);
    const ytdTrend = getTrend(ytdPercentage);

    const salesStatics = getStatics(salesTrend, "yesterday");
    const mtdStatics = getStatics(mtdTrend, "last month");
    const ytdStatics = getStatics(ytdTrend, "last year");

        // total visitors percentage, trends, statics
        const [todayVisitorCo, prevDayVisitorCo, prevMonthVisitorCo, prevYearVisitorCo] = await Promise.all([
          CookieAcceptance.find({ ...currentDayFilter }),
          CookieAcceptance.find({ ...previousDayFilter }),
          CookieAcceptance.find({ ...previousMonthFilter }),
          CookieAcceptance.find({ ...previousYearFilter }),
        ]);
    
        // Calculate sales
        const calculateTotalVisitors = (visitors) => {
          // Sum up the `count` field for all visitors
          return visitors.reduce((total, visitor) => total + (visitor.count || 0), 0);
        };
    
        const todayVisitors = calculateTotalVisitors(todayVisitorCo);
        const prevDayVisitors = calculateTotalVisitors(prevDayVisitorCo);
        const prevMonthVisitors = calculateTotalVisitors(prevMonthVisitorCo);
        const prevYearVisitors = calculateTotalVisitors(prevYearVisitorCo);
    
        // Calculate percentages and trends
        const visitorsPercentage = calculatePercentage(todayVisitors, prevDayVisitors);
        const visitorMtdPercentage = calculatePercentage(mtdVisitors, prevMonthVisitors);
        const visitorYtdPercentage = calculatePercentage(ytdVisitors, prevYearVisitors);
    
        const visitorTrend = getTrend(visitorsPercentage);
        const visitorMtdTrend = getTrend(visitorMtdPercentage);
        const visitorYtdTrend = getTrend(visitorYtdPercentage);
    
        const visitorStatics = getStatics(visitorTrend, "yesterday");
        const visitorMtdStatics = getStatics(visitorMtdTrend, "last month");
        const visitorYtdStatics = getStatics(visitorYtdTrend, "last year");

    res.status(200).json({
      success: true,
      message: startDate && endDate
        ? 'Counts fetched successfully for the specified date range'
        : 'Total counts fetched successfully',
      data: {
        productStock,
        categoryCount,
        cartCount,
        totalProducts: productCount,
        visitors: {
          total: totalVisitor,
          percentage: visitorsPercentage.toFixed(0) + '%',
          trend: visitorTrend,
          statics: visitorStatics,
          monthly: {
            total:mtdVisitors,
            percentage: visitorMtdPercentage.toFixed(0) + '%',
            trend: visitorMtdTrend,
            statics: visitorMtdStatics,
          },
          yearly: {
            total: ytdVisitors,
            percentage: visitorYtdPercentage.toFixed(0) + '%',
            trend: visitorYtdTrend,
            statics: visitorYtdStatics,
          },
        },
        users: {
          total: userCount,
          monthly: mtdUsers,
          yearly: ytdUsers,
        },
        orders: {
          total: orderCount,
          monthly: mtdOrders,
          yearly: ytdOrders,
        },
        statuses: {
          total: statusCounts,
          monthly: mtdStatusCounts,
          yearly: ytdStatusCounts,
        },
        sales: {
          total: totalSalesAmount,
          percentage: salesPercentage.toFixed(0) + '%',
          trend: salesTrend,
          statics: salesStatics,
          monthly: {
            total: totalMtdSalesAmount,
            percentage: mtdPercentage.toFixed(0) + '%',
            trend: mtdTrend,
            statics: mtdStatics,
          },
          yearly: {
            total: totalYtdSalesAmount,
            percentage: ytdPercentage.toFixed(0) + '%',
            trend: ytdTrend,
            statics: ytdStatics,
          },
        },
        salesReturn: {
          total: returnSalesAmount,
          return: damageSalesAmount,
          cancel: cancelSalesAmount,
        },


      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching counts",
      error: error.message,
    });
  }
};