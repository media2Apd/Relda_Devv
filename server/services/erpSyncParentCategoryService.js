const {
  upsertParentCategoryByErpIdRepo,
  deleteParentCategoryByErpIdRepo,
} = require("../repositories/erpSyncParentCategoryRepo.js");

const syncParentCategoryFromErpService = async (organizationId, payload) => {
  const { erpId, name, categoryImage, isHide, action } = payload;

  if (!erpId) {
    throw new Error("erpId is required");
  }

  // DELETE
  if (action === "DELETE") {
    const deleted = await deleteParentCategoryByErpIdRepo(organizationId, erpId);
    return { action, erpId, deleted: !!deleted };
  }

  // UPSERT (default)
  const category = await upsertParentCategoryByErpIdRepo(
    organizationId,
    erpId,
    {
      name,
      categoryImage,
      isHide: isHide || false,
    }
  );

  return { action: action || "UPSERT", erpId, data: category };
};

module.exports = {
  syncParentCategoryFromErpService,
};
