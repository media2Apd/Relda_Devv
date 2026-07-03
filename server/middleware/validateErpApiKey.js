const crypto = require("crypto");

const validateErpApiKey = (req, res, next) => {
  try {
    const apiKey = req.headers["x-erp-api-key"];
    const organizationId = req.headers["x-organization-id"];

    if (!apiKey || !organizationId) {
      return res.status(401).json({
        success: false,
        message: "Missing ERP API key or organization ID",
      });
    }

    // .env la hash store pannunga (sha256 of your shared key)
    const expectedKeyHash = process.env.ERP_MASTER_KEY_HASH;

    if (!expectedKeyHash) {
      console.error("ERP_MASTER_KEY_HASH not set in env");
      return res.status(500).json({
        success: false,
        message: "Server misconfigured",
      });
    }

    const providedKeyHash = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");

    if (providedKeyHash !== expectedKeyHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid ERP API key",
      });
    }

    req.organizationId = organizationId;
    next();
  } catch (error) {
    console.error("ERP auth error:", error);
    return res.status(500).json({
      success: false,
      message: "ERP authentication failed",
    });
  }
};

module.exports = validateErpApiKey;
