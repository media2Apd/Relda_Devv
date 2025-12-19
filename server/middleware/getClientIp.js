// middleware/getClientIp.js
function getClientIp(req, res, next) {
    req.ipAddress = req.ip; // Sets the IP address on req.ipAddress
    next();
}

module.exports = getClientIp;
