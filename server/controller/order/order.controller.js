const orderModel = require("../../models/orderProductModel");

const orderController = async (request, response) => {
    try {
        // Check if userId is available in request (assuming it's coming from JWT or session)
        const currentUserId = request.userId;

        if (!currentUserId) {
            return response.status(400).json({
                success: false,
                message: "User ID is required. Please login.",
            });
        }

        // Fetch the order list for the current user where payment status is 'success'
        const orderList = await orderModel.find({
            userId: currentUserId,
            'paymentDetails.payment_status': 'success' // Filter by successful payment status
        }).sort({ createdAt: -1 });

        // Check if any orders were found
        if (orderList.length === 0) {
            return response.status(404).json({
                success: false,
                message: "No successful orders found for this user.",
            });
        }

        // Return the orders in a response
        return response.status(200).json({
            success: true,
            message: "Order list retrieved successfully.",
            data: orderList,
        });

    } catch (error) {
        console.error("Error fetching order list:", error.message);
        return response.status(500).json({
            success: false,
            message: "An error occurred while fetching orders.",
            error: error.message || "Internal server error.",
        });
    }
};


const viewOrderController = async (request, response) => {
    try {
        const { orderId } = request.params; // Extract orderId from URL parameters
        const currentUserId = request.userId;

        if (!currentUserId) {
            return response.status(400).json({
                success: false,
                message: "User ID is required. Please login.",
            });
        }

        // Fetch the specific order by orderId and userId
        const order = await orderModel.findOne({
            orderId: orderId, // Match the string orderId, not _id
            userId: currentUserId, // Ensure the order belongs to the current user
            'paymentDetails.payment_status': 'success', // Only show orders with successful payment
        });

        // Check if the order exists
        if (!order) {
            return response.status(404).json({
                success: false,
                message: "Order not found or payment was not successful.",
            });
        }

        // Return the order details
        return response.status(200).json({
            success: true,
            message: "Order details retrieved successfully.",
            data: order,
        });

    } catch (error) {
        console.error("Error fetching order details:", error.message);
        return response.status(500).json({
            success: false,
            message: "An error occurred while fetching the order.",
            error: error.message || "Internal server error.",
        });
    }
};



module.exports = {orderController,viewOrderController};