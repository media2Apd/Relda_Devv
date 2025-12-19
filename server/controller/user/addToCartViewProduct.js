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

const addToCartViewProduct = async(req,res)=>{
    try{
        const currentUser = req.userId

        const allProduct = await addToCartModel.find({
            userId : currentUser
        }).populate("productId")

        res.json({
            data : allProduct,
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

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

//     // Grouping by User
//     const userGroupedCart = {};

//     allCartItems.forEach((item) => {
//       const userId = item.userId._id.toString();

//       if (!userGroupedCart[userId]) {
//         userGroupedCart[userId] = {
//           user: item.userId,
//           totalProducts: 0,
//           categories: {},
//           products: [],
//         };
//       }

//       const existingProductIndex = userGroupedCart[userId].products.findIndex(
//         (p) => p.productId._id.toString() === item.productId._id.toString()
//       );

//       if (existingProductIndex === -1) {
//         userGroupedCart[userId].products.push({
//           productId: item.productId,
//           quantity: 1,
//         });
//       } else {
//         userGroupedCart[userId].products[existingProductIndex].quantity += 1;
//       }

//       // Update Category Count
//       const category = item.productId.category;
//       userGroupedCart[userId].categories[category] =
//         (userGroupedCart[userId].categories[category] || 0) + 1;

//       // Update total products count
//       userGroupedCart[userId].totalProducts += 1;
//     });

//     res.status(200).json({
//       data: {
//         usersCart: Object.values(userGroupedCart), // Convert object to array
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

const addToCartViewAllProduct = async (req, res) => {
  try {
    const { userId, category, fromDate, toDate } = req.query;
    const query = {};

    if (userId) query.userId = userId;
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

    // **Apply category filtering AFTER population**
    if (category) {
      allCartItems = allCartItems.filter((item) => 
        item.productId && item.productId.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Remove items with null userId
    allCartItems = allCartItems.filter((item) => item.userId);

    res.status(200).json({
      data: {
        allCartItems, // Return only filtered items
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


module.exports =  {addToCartViewProduct, addToCartViewAllProduct}