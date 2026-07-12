const {
  syncCategoryFromErpService,
} = require("../services/erpSyncCategoryService");

const syncCategoryController = async (req, res) => {
  try {
    const result = await syncCategoryFromErpService(
      req.organizationId,
      req.body
    );

    console.log("ERP sync category payload:", req.body);
    console.log("ERP sync category result:", result);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("ERP sync category error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  syncCategoryController,
};
