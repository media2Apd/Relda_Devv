// const userModel = require("../../models/userModel")

// async function allUsers(req,res){
//     try{
//         console.log("userid all Users",req.userId)

//         const allUsers = await userModel.find()
        
//         res.json({
//             message : "All User ",
//             data : allUsers,
//             success : true,
//             error : false
//         })
//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = allUsers
const userModel = require("../../models/userModel");

async function allUsers(req, res) {
    try {
        console.log("userid all Users", req.userId);

        const { fromDate, toDate, month, year } = req.query;
        let filter = {};

        // Apply single date filter
        if (fromDate && !toDate) {
            const start = new Date(fromDate);
            const end = new Date(fromDate);
            end.setHours(23, 59, 59, 999); // Set end date to end of the day
            
            filter.createdAt = {
                $gte: start,
                $lte: end
            };
        } else if (fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999); // Set end date to end of the day
            
            filter.createdAt = {
                $gte: start,
                $lte: end
            };
        } else if (month && year) {
            const monthFilter = {
                $expr: {
                    $and: [
                        { $eq: [{ $month: "$createdAt" }, parseInt(month, 10)] },
                        { $eq: [{ $year: "$createdAt" }, parseInt(year, 10)] }
                    ]
                }
            };
            filter = { ...filter, ...monthFilter };
        }

        const allUsers = await userModel.find(filter);

        res.json({
            message: "All User",
            data: allUsers,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = allUsers;