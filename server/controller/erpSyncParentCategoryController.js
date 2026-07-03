const {
  syncParentCategoryFromErpService,
} = require("../services/erpSyncParentCategoryService");

const syncParentCategoryController = async (req, res) => {
  try {
    const result = await syncParentCategoryFromErpService(
      req.organizationId,
      req.body
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("ERP sync parent category error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  syncParentCategoryController,
};
