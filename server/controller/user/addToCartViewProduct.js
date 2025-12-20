// const addToCartModel = require("../../models/cartProduct")
// const userModel = require("../../models/userModel");

// const addToCartViewProduct = async(req,res)=>{
//     try{
//         const currentUser = req.userId

//         const allProduct = await addToCartModel.find({
//             userId : currentUser
//         }).populate("productId")

//         res.json({
//             data : allProduct,
//             success : true,
//             error : false
//         })

//     }catch(err){
//         res.json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// // GET Cart Items
// const addToCartViewAllProduct = async (req, res) => {
//   try {
//     const { userId, category, fromDate, toDate } = req.query;

//     // Base query to fetch cart items
//     const query = {};

//     // Filter by user ID if provided
//     if (userId) query.userId = userId;

//     // Filter by category if provided
//     if (category) query['productId.category'] = category;

//     // Filter by date range if provided
//     if (fromDate || toDate) {
//       query.createdAt = {};
//       if (fromDate) query.createdAt.$gte = new Date(fromDate);
//       if (toDate) query.createdAt.$lte = new Date(toDate);
//     }

//     // Fetch cart items from the database and populate with relevant fields
//     const allCartItems = await addToCartModel.find(query)
//       .populate('productId', 'productName category sellingPrice price productImage') // Only select needed fields from product
//       .populate('userId', 'name email mobile address') // Only select needed fields from user
//       .lean();

//     // Sort the cart items to show the most recent first (descending order of createdAt)
//     allCartItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     // Group products by category
//     const categoryWiseCart = {};
//     allCartItems.forEach((item) => {
//       const category = item.productId.category;
//       if (!categoryWiseCart[category]) {
//         categoryWiseCart[category] = [];
//       }
//       categoryWiseCart[category].push(item);
//     });

//     // Create user-wise cart summary
//     const userCartSummary = {};
//     allCartItems.forEach((item) => {
//       const userId = item.userId._id.toString();
//       const category = item.productId.category;

//       if (!userCartSummary[userId]) {
//         userCartSummary[userId] = {
//           totalProducts: 0,
//           categories: {},
//         };
//       }

//       userCartSummary[userId].totalProducts += 1;
//       userCartSummary[userId].categories[category] =
//         (userCartSummary[userId].categories[category] || 0) + 1;
//     });

//     // Return the response with category-wise data
//     res.status(200).json({
//       data: {
//         allCartItems,
//         userCartSummary,
//         categoryWiseCart,
//       },
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     console.error('Error fetching cart items:', error);
//     res.status(500).json({
//       message: 'Error fetching cart items.',
//       error: true,
//       success: false,
//     });
//   }
// };
// module.exports =  {addToCartViewProduct, addToCartViewAllProduct}

const addToCartModel = require("../../models/cartProduct")
const userModel = require("../../models/userModel");

// const addToCartViewProduct = async(req,res)=>{
//     try{
//         const currentUser = req.userId

//         const allProduct = await addToCartModel.find({
//             userId : currentUser
//         }).populate("productId")

//         res.json({
//             data : allProduct,
//             success : true,
//             error : false
//         })

//     }catch(err){
//         res.json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }
const addToCartViewProduct = async (req, res) => {
  try {
    const userId = req.userId || null;
    const sessionId = req.sessionId || null;

    // Safety check
    if (!userId && !sessionId) {
      return res.json({
        data: [],
        success: true,
        error: false
      });
    }

    const filter = userId
      ? { userId }
      : { sessionId };

    const allProduct = await addToCartModel
      .find(filter)
      .populate("productId");

    res.json({
      data: allProduct,
      success: true,
      error: false
    });

  } catch (err) {
    res.json({
      message: err.message,
      error: true,
      success: false
    });
  }
};


// GET Cart Items
// const addToCartViewAllProduct = async (req, res) => {
//   try {
//     const { userId, category, fromDate, toDate } = req.query;

//     // Base query to fetch cart items
//     const query = {};

//     // Filter by user ID if provided
//     if (userId) query.userId = userId;

//     // Filter by category if provided
//     if (category) query['productId.category'] = category;

//     // Filter by date range if provided
//     // if (fromDate || toDate) {
//     //   query.createdAt = {};
//     //   if (fromDate) query.createdAt.$gte = new Date(fromDate);
//     //   if (toDate) query.createdAt.$lte = new Date(toDate);
//     // }
//     if (fromDate || toDate) {
//       query.createdAt = {};

//       // Ensure fromDate starts at 0:00:00
//       if (fromDate) {
//         const start = new Date(fromDate);
//         start.setHours(0, 0, 0, 0); // Sets time to 00:00:00.000
//         query.createdAt.$gte = start;
//       }

//       // Ensure toDate ends at 23:59:59.999
//       if (toDate) {
//         const end = new Date(toDate);
//         end.setHours(23, 59, 59, 999); // Sets time to 23:59:59.999
//         query.createdAt.$lte = end;
//       }
//     }


//     // Fetch cart items from the database and populate with relevant fields
//     const allCartItems = await addToCartModel.find(query)
//       .populate('productId', 'productName category sellingPrice price productImage') // Only select needed fields from product
//       .populate('userId', 'name email mobile address') // Only select needed fields from user
//       .lean();

//     // Sort the cart items to show the most recent first (descending order of createdAt)
//     allCartItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     // Group products by category
//     const categoryWiseCart = {};
//     allCartItems.forEach((item) => {
//       const category = item.productId.category;
//       if (!categoryWiseCart[category]) {
//         categoryWiseCart[category] = [];
//       }
//       categoryWiseCart[category].push(item);
//     });

//     // Create user-wise cart summary
//     const userCartSummary = {};
//     allCartItems.forEach((item) => {
//       const userId = item.userId._id.toString();
//       const category = item.productId.category;

//       if (!userCartSummary[userId]) {
//         userCartSummary[userId] = {
//           totalProducts: 0,
//           categories: {},
//         };
//       }

//       userCartSummary[userId].totalProducts += 1;
//       userCartSummary[userId].categories[category] =
//         (userCartSummary[userId].categories[category] || 0) + 1;
//     });

//     // Return the response with category-wise data
//     res.status(200).json({
//       data: {
//         allCartItems,
//         userCartSummary,
//         categoryWiseCart,
//       },
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     console.error('Error fetching cart items:', error);
//     res.status(500).json({
//       message: 'Error fetching cart items.',
//       error: true,
//       success: false,
//     });
//   }
// };

// const addToCartViewAllProduct = async (req, res) => {
//   try {
//     const { userId, category, fromDate, toDate } = req.query;
//     const query = {};
//     if (userId) query.userId = userId;
//     if (category) query['productId.category'] = category;
//     if (fromDate || toDate) {
//       query.createdAt = {};
//       if (fromDate) {
//         const start = new Date(fromDate);
//         start.setHours(0, 0, 0, 0);
//         query.createdAt.$gte = start;
//       }
//       if (toDate) {
//         const end = new Date(toDate);
//         end.setHours(23, 59, 59, 999);
//         query.createdAt.$lte = end;
//       }
//     }
//     let allCartItems = await addToCartModel
//       .find(query)
//       .populate('productId', 'productName category sellingPrice price productImage')
//       .populate('userId', 'name email mobile address')
//       .lean();
//     // Remove items with null userId
//     allCartItems = allCartItems.filter((item) => item.userId);
//     // Group cart items by productId and category, and count quantity per product
//     const groupedCartItems = {};
//     allCartItems.forEach((item) => {
//       const userId = item.userId._id.toString();
//       const productId = item.productId._id.toString();
//       const category = item.productId.category;
//       // Create a key for each product under each user
//       const key = `${userId}_${productId}`;
//       if (!groupedCartItems[key]) {
//         groupedCartItems[key] = {
//           ...item,
//           quantity: 1, // Initialize quantity
//         };
//       } else {
//         groupedCartItems[key].quantity += 1; // Increment quantity if product already exists
//       }
//       // If a new category is added, group by category
//       if (!groupedCartItems[key].categories) {
//         groupedCartItems[key].categories = {};
//       }
//       groupedCartItems[key].categories[category] =
//         (groupedCartItems[key].categories[category] || 0) + 1;
//     });
//     // Convert the groupedCartItems object to an array
//     const uniqueCartItems = Object.values(groupedCartItems);
//     // Sort items by createdAt
//     uniqueCartItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     // Aggregate cart data by category
//     const categoryWiseCart = {};
//     uniqueCartItems.forEach((item) => {
//       const category = item.productId.category;
//       if (!categoryWiseCart[category]) {
//         categoryWiseCart[category] = [];
//       }
//       categoryWiseCart[category].push(item);
//     });
//     // Create user summary (total products and categories)
//     const userCartSummary = {};
//     uniqueCartItems.forEach((item) => {
//       const userId = item.userId._id.toString();
//       const category = item.productId.category;
//       if (!userCartSummary[userId]) {
//         userCartSummary[userId] = {
//           totalProducts: 0,
//           categories: {},
//         };
//       }
//       userCartSummary[userId].totalProducts += item.quantity; // Add quantity to total
//       userCartSummary[userId].categories[category] =
//         (userCartSummary[userId].categories[category] || 0) + item.quantity; // Aggregate category-wise count
//     });
//     res.status(200).json({
//       data: {
//         allCartItems: uniqueCartItems, // Return only unique cart items
//         userCartSummary,
//         categoryWiseCart,
//       },
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     console.error('Error fetching cart items:', error);
//     res.status(500).json({
//       message: 'Error fetching cart items.',
//       error: true,
//       success: false,
//     });
//   }
// };
// module.exports = { addToCartViewProduct, addToCartViewAllProduct }

const addToCartViewAllProduct = async (req, res) => {
  try {
    const { userId, category, fromDate, toDate } = req.query;
    const query = {};

    if (userId) query.userId = userId;
    if (category) query['productId.category'] = category;

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        query.createdAt.$gte = start;
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    let allCartItems = await addToCartModel
      .find(query)
      .populate('productId', 'productName category sellingPrice price productImage')
      .populate('userId', 'name email mobile address')
      .lean();

    // Only logged user carts (ADMIN VIEW)
    allCartItems = allCartItems.filter(item => item.userId);

    const groupedCartItems = {};

    allCartItems.forEach(item => {
      const uid = item.userId._id.toString();
      const pid = item.productId._id.toString();
      const key = `${uid}_${pid}`;

      if (!groupedCartItems[key]) {
        groupedCartItems[key] = { ...item, quantity: 1 };
      } else {
        groupedCartItems[key].quantity += 1;
      }
    });

    const uniqueCartItems = Object.values(groupedCartItems)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const categoryWiseCart = {};
    uniqueCartItems.forEach(item => {
      const category = item.productId.category;
      if (!categoryWiseCart[category]) categoryWiseCart[category] = [];
      categoryWiseCart[category].push(item);
    });

    const userCartSummary = {};
    uniqueCartItems.forEach(item => {
      const uid = item.userId._id.toString();
      const category = item.productId.category;

      if (!userCartSummary[uid]) {
        userCartSummary[uid] = { totalProducts: 0, categories: {} };
      }

      userCartSummary[uid].totalProducts += item.quantity;
      userCartSummary[uid].categories[category] =
        (userCartSummary[uid].categories[category] || 0) + item.quantity;
    });

    res.status(200).json({
      data: {
        allCartItems: uniqueCartItems,
        userCartSummary,
        categoryWiseCart,
      },
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      message: "Error fetching cart items.",
      error: true,
      success: false,
    });
  }
};

module.exports = { addToCartViewProduct, addToCartViewAllProduct };