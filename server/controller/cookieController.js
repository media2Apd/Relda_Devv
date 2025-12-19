const CookieAcceptance = require('../models/CookieAcceptance');
const axios = require('axios');
const DeveloperIP = require('../models/DeveloperIP'); // Import the model


// const acceptCookies = async (req, res) => {
//     try {
//         const clientIpAddress = req.headers['x-forwarded-for'] || req.ip; // Get client's IP address
//         console.log("Client IP Address:", clientIpAddress);

//         // Check if a cookie acceptance entry already exists for the given IP address
//         const existingAcceptance = await CookieAcceptance.findOne({
//             ipAddress: clientIpAddress,
//         });
 
//         if (existingAcceptance) {
//             // Ensure acceptanceTimestamps is always an array
//             if (!Array.isArray(existingAcceptance.acceptanceTimestamps)) {
//                 existingAcceptance.acceptanceTimestamps = []; // Initialize if it's undefined or not an array
//             }

//             // Increment count and add a new timestamp to the existing entry
//             existingAcceptance.count += 1; // Increase visit count
//             existingAcceptance.acceptanceTimestamps.push(new Date()); // Add current timestamp

//             await existingAcceptance.save(); // Save the updated entry

//             res.status(200).json({
//                 message: 'Cookie acceptance updated successfully.',
//                 count: existingAcceptance.count,
//                 acceptanceTimestamps: existingAcceptance.acceptanceTimestamps, // Return the updated timestamps array
//             });
//         } else {
//             // Create a new entry if none exists for this IP address
//             const newCookieAcceptance = new CookieAcceptance({
//                 ipAddress: clientIpAddress,
//                 accepted: true,
//                 acceptanceTimestamps: [new Date()], // Start with the current timestamp
//                 count: 1, // First acceptance, so count starts at 1
//             });
//             await newCookieAcceptance.save();
//             res.status(200).json({
//                 message: 'Cookie acceptance saved successfully.',
//                 count: newCookieAcceptance.count,
//                 acceptanceTimestamps: newCookieAcceptance.acceptanceTimestamps,
//             });
//         }
//     } catch (error) {
//         console.error('Error saving cookie acceptance:', error);
//         res.status(500).json({ message: 'Error saving cookie acceptance.' });
//     }
// }

// Fetch all cookie acceptance data
// const getAllCookieAcceptanceData = async (req, res) => {
//     try {
//         const allData = await CookieAcceptance.find(); // Fetch all documents from the collection
//         res.status(200).json({
//             message: 'Cookie acceptance data retrieved successfully.',
//             data: allData,
//         });
//     } catch (error) {
//         console.error('Error fetching cookie acceptance data:', error);
//         res.status(500).json({ message: 'Error fetching cookie acceptance data.' });
//     }
// };

const acceptCookies = async (req, res) => {
    try {
        const clientIpAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        console.log("Client IP Address:", clientIpAddress);

        // 🔽 Fetch all dev IPs from DB
        const devIPs = await DeveloperIP.find({});
        const developerIPs = devIPs.map(dev => dev.ipAddress);

        // 🔥 If developer IP detected, skip saving
        if (developerIPs.includes(clientIpAddress)) {
            return res.status(200).json({
                message: 'Developer IP detected. Cookie acceptance not stored.',
                dev: true,
            });
        }

        // Check if the IP already exists
        let existingAcceptance = await CookieAcceptance.findOne({ ipAddress: clientIpAddress });

        if (existingAcceptance) {
            if (!Array.isArray(existingAcceptance.acceptanceTimestamps)) {
                existingAcceptance.acceptanceTimestamps = [];
            }

            existingAcceptance.count += 1;
            existingAcceptance.acceptanceTimestamps.push(new Date());
            await existingAcceptance.save();

            return res.status(200).json({
                message: 'Cookie acceptance updated successfully.',
                count: existingAcceptance.count,
                acceptanceTimestamps: existingAcceptance.acceptanceTimestamps,
            });
        } else {
            const newCookieAcceptance = new CookieAcceptance({
                ipAddress: clientIpAddress,
                accepted: true,
                acceptanceTimestamps: [new Date()],
                count: 1,
            });

            await newCookieAcceptance.save();

            return res.status(200).json({
                message: 'Cookie acceptance saved successfully.',
                count: newCookieAcceptance.count,
                acceptanceTimestamps: newCookieAcceptance.acceptanceTimestamps,
            });
        }
    } catch (error) {
        console.error('Error saving cookie acceptance:', error);
        res.status(500).json({ message: 'Error saving cookie acceptance.' });
    }
};

// const getAllCookieAcceptanceData = async (req, res) => {
//     try {
//         const { from, to, page = 1, limit = 10 } = req.query;

//         // Convert query parameters to Date objects
//         const fromDate = from ? new Date(from) : null;
//         const toDate = to ? new Date(to) : null;

//         if (toDate) {
//             toDate.setHours(23, 59, 59, 999); // Set the end of the day for accurate filtering
//         }

//         // Function to filter acceptanceTimestamps based on the date range
//         const filterAcceptanceTimestamps = (timestamps) => {
//             return timestamps.filter(timestamp => {
//                 const timestampDate = new Date(timestamp);
//                 if (fromDate && timestampDate < fromDate) return false;
//                 if (toDate && timestampDate > toDate) return false;
//                 return true;
//             });
//         };

//         // Query only relevant documents
//         const query = {};
//         if (fromDate || toDate) {
//             query['acceptanceTimestamps'] = {};
//             if (fromDate) query['acceptanceTimestamps'].$gte = fromDate;
//             if (toDate) query['acceptanceTimestamps'].$lte = toDate;
//         }

//         const allData = await CookieAcceptance.find(query)
//             .skip((page - 1) * limit)
//             .limit(limit);

//         const getGeolocation = async (ip) => {
//             try {
//                 const geoResponse = await axios.get(`https://ipinfo.io/${ip}/json?token=05bfdd7ab8421b`);
//                 return geoResponse.data;
//             } catch (error) {
//                 console.error(`Error fetching geolocation for IP ${ip}:`, error);
//                 return { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
//             }
//         };

//         const filteredData = await Promise.all(allData.map(async (item) => {
//             const filteredTimestamps = filterAcceptanceTimestamps(item.acceptanceTimestamps);

//             // If no timestamps match the filter, exclude this record
//             if (filteredTimestamps.length === 0) return null;

//             const ips = item.ipAddress.split(',').map(ip => ip.trim());
//             const geoData = await Promise.all(ips.map(ip => getGeolocation(ip)));

//             const locations = geoData.map((geo, index) => ({
//                 ipAddress: geo ? geo.ip : ips[index],
//                 location: geo ? { city: geo.city, region: geo.region, country: geo.country, loc:geo.loc } : {},
//                 ipNumber: geo ? geo.ip : ips[index],
//             }));

//             return {
//                 ...item.toObject(),
//                 ipLocations: locations,
//                 acceptanceTimestamps: filteredTimestamps,
//                 count: item.count,
//             };
//         }));

//         // Remove null values (records without matching timestamps)
//         const finalData = filteredData.filter(item => item !== null);

//         if (finalData.length === 0) {
//             return res.status(404).json({
//                 message: 'No cookie acceptance data found for the given date range.',
//                 data: []
//             });
//         }

//         res.status(200).json({
//             message: 'Filtered cookie acceptance data with IP geolocation retrieved successfully.',
//             data: finalData,
//         });
//     } catch (error) {
//         console.error('Error fetching cookie acceptance data:', error);
//         res.status(500).json({ message: 'Error fetching cookie acceptance data.' });
//     }
// };


const getAllCookieAcceptanceData = async (req, res) => {
    try {
        const { from, to, page = 1, limit = 10 } = req.query;

        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;
        if (toDate) toDate.setHours(23, 59, 59, 999);

        const filterAcceptanceTimestamps = (timestamps) => {
            return timestamps.filter(timestamp => {
                const timestampDate = new Date(timestamp);
                if (fromDate && timestampDate < fromDate) return false;
                if (toDate && timestampDate > toDate) return false;
                return true;
            });
        };

        const query = {};
        if (fromDate || toDate) {
            query['acceptanceTimestamps'] = {};
            if (fromDate) query['acceptanceTimestamps'].$gte = fromDate;
            if (toDate) query['acceptanceTimestamps'].$lte = toDate;
        }

        // 🔽 Step: Fetch developer IPs from DB
        const devIPDocs = await DeveloperIP.find({});
        const developerIPs = devIPDocs.map(doc => doc.ipAddress);

        const allData = await CookieAcceptance.find(query)
           // .skip((page - 1) * limit)
            //.limit(limit);

        const getGeolocation = async (ip) => {
            try {
                const geoResponse = await axios.get(`https://ipinfo.io/${ip}/json?token=05bfdd7ab8421b`);
                return geoResponse.data;
            } catch (error) {
                console.error(`Error fetching geolocation for IP ${ip}:`, error);
                return { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
            }
        };

        const filteredData = await Promise.all(allData.map(async (item) => {
            const filteredTimestamps = filterAcceptanceTimestamps(item.acceptanceTimestamps);
            if (filteredTimestamps.length === 0) return null;

            const ips = item.ipAddress.split(',').map(ip => ip.trim());

            const isDevIP = ips.some(ip => developerIPs.includes(ip));
            if (isDevIP) {
                // 🔥 Delete the entry if it's from a developer IP
                await CookieAcceptance.deleteOne({ _id: item._id });
                return null;
            }

            const geoData = await Promise.all(ips.map(ip => getGeolocation(ip)));

            const locations = geoData.map((geo, index) => ({
                ipAddress: geo ? geo.ip : ips[index],
                location: geo ? { city: geo.city, region: geo.region, country: geo.country, loc: geo.loc } : {},
                ipNumber: geo ? geo.ip : ips[index],
            }));

            return {
                ...item.toObject(),
                ipLocations: locations,
                acceptanceTimestamps: filteredTimestamps,
                count: item.count,
            };
        }));

        const finalData = filteredData.filter(item => item !== null);

        if (finalData.length === 0) {
            return res.status(404).json({
                message: 'No cookie acceptance data found for the given date range.',
                data: []
            });
        }

        res.status(200).json({
            message: 'Filtered cookie acceptance data retrieved successfully.',
            data: finalData,
        });
    } catch (error) {
        console.error('Error fetching cookie acceptance data:', error);
        res.status(500).json({ message: 'Error fetching cookie acceptance data.' });
    }
};




module.exports = { acceptCookies, getAllCookieAcceptanceData };