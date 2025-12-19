// const orderModel = require("../../models/orderProductModel");
// const userModel = require("../../models/userModel");

// const allOrderController = async (request, response) => {
//     try {
//         const userId = request.userId;

//         const user = await userModel.findById(userId);

//         // Check if user exists and has the ADMIN role
//         if (!user || user.role !== 'ADMIN') {
//             return response.status(403).json({
//                 message: "Access denied",
//                 success: false,
//             });
//         }

//         // Extract query parameters for filtering
//         const { orderId, fromDate, toDate, orderStatus } = request.query;
//         const filter = {};

//         // Add `orderId` filter if provided
//         if (orderId) {
//             filter.orderId = { $regex: orderId, $options: "i" }; // 'i' makes it case-insensitive
//         }

//         // Add `date` filter if provided
//         // if (date) {
//         //     const startOfDay = new Date(date);
//         //     startOfDay.setHours(0, 0, 0, 0);
//         //     const endOfDay = new Date(date);
//         //     endOfDay.setHours(23, 59, 59, 999);

//         //     filter.createdAt = {
//         //         $gte: startOfDay,
//         //         $lte: endOfDay,
//         //     };
//         // }
//         if (fromDate && toDate) {
//             const startOfDay = new Date(fromDate);
//             startOfDay.setHours(0, 0, 0, 0);  // Start of "from" date
        
//             const endOfDay = new Date(toDate);
//             endOfDay.setHours(23, 59, 59, 999);  // End of "to" date
        
//             filter.createdAt = {
//                 $gte: startOfDay,  // Greater than or equal to "from" date
//                 $lte: endOfDay,    // Less than or equal to "to" date
//             };
//         } else if (fromDate) {
//             // If only "fromDate" is provided, set the filter for the start date
//             const startOfDay = new Date(fromDate);
//             startOfDay.setHours(0, 0, 0, 0);  // Start of "from" date
        
//             filter.createdAt = {
//                 $gte: startOfDay,  // Greater than or equal to "from" date
//             };
//         } else if (toDate) {
//             // If only "toDate" is provided, set the filter for the end date
//             const endOfDay = new Date(toDate);
//             endOfDay.setHours(23, 59, 59, 999);  // End of "to" date
        
//             filter.createdAt = {
//                 $lte: endOfDay,  // Less than or equal to "to" date
//             };
//         }
        

//         // Add `orderStatus` filter if provided
//         if (orderStatus) {
//             filter.order_status = orderStatus;
//         }

//         // Fetch filtered orders
//         const allOrders = await orderModel.find(filter)
//             .populate('userId', 'email') // Populate email from the user
//             .sort({ createdAt: -1 });

//         // Transform returnImages binary data into base64
//         const formattedOrders = allOrders.map(order => ({
//             ...order.toObject(), // Convert Mongoose document to plain object
//             returnImages: order.returnImages.map(image => ({
//                 imageBase64: `data:${image.contentType};base64,${image.data.toString('base64')}`, // Base64-encoded data
//             })),
//         }));

//         // Send response with formatted orders
//         return response.status(200).json({
//             data: formattedOrders,
//             success: true,
//         });
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//         });
//     }
// };

// module.exports = allOrderController;

const orderModel = require("../../models/orderProductModel");
const userModel = require("../../models/userModel");

const allOrderController = async (request, response) => {
    try {
        const userId = request.userId;
        const user = await userModel.findById(userId);

        // Check if user exists and has the ADMIN role
        if (!user || user.role !== 'ADMIN') {
            return response.status(403).json({
                message: "Access denied",
                success: false,
            });
        }

        // Extract query parameters for filtering
        const { orderId, fromDate, toDate, orderStatus, exclude_status } = request.query;
        const filter = {};

        // Add `orderId` filter if provided
        if (orderId) {
            filter.orderId = { $regex: orderId, $options: "i" }; // 'i' makes it case-insensitive
        }

        // Add `date` filter if provided
        if (fromDate && toDate) {
            const startOfDay = new Date(fromDate);
            startOfDay.setHours(0, 0, 0, 0);  // Start of "from" date
        
            const endOfDay = new Date(toDate);
            endOfDay.setHours(23, 59, 59, 999);  // End of "to" date
        
            filter.createdAt = {
                $gte: startOfDay,  // Greater than or equal to "from" date
                $lte: endOfDay,    // Less than or equal to "to" date
            };
        } else if (fromDate) {
            const startOfDay = new Date(fromDate);
            startOfDay.setHours(0, 0, 0, 0);  // Start of "from" date
        
            filter.createdAt = {
                $gte: startOfDay,  // Greater than or equal to "from" date
            };
        } else if (toDate) {
            const endOfDay = new Date(toDate);
            endOfDay.setHours(23, 59, 59, 999);  // End of "to" date
        
            filter.createdAt = {
                $lte: endOfDay,  // Less than or equal to "to" date
            };
        }

        // Add `orderStatus` filter if provided
        if (orderStatus) {
            filter.order_status = orderStatus;
        }

        // Exclude `exclude_status` if provided
        if (exclude_status) {
            if (!filter.order_status) {
                filter.order_status = { $ne: exclude_status };
            } else {
                filter.order_status = { ...filter.order_status, $ne: exclude_status };
            }
        }

        // Fetch filtered orders
        const allOrders = await orderModel.find(filter)
            .populate('userId', 'email') // Populate email from the user
            .sort({ createdAt: -1 });

        // Transform returnImages binary data into base64
        const formattedOrders = allOrders.map(order => ({
            ...order.toObject(), // Convert Mongoose document to plain object
            returnImages: order.returnImages.map(image => ({
                imageBase64: `data:${image.contentType};base64,${image.data.toString('base64')}`, // Base64-encoded data
            })),
        }));

        // Send response with formatted orders
        return response.status(200).json({
            data: formattedOrders,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
        });
    }
};

module.exports = allOrderController;
