const {
  upsertCategoryByErpIdRepo,
  deleteCategoryByErpIdRepo,
} = require("../repositories/erpSyncCategoryRepo");

const syncCategoryFromErpService = async (organizationId, payload) => {
  const {
    erpId,
    label,
    value,
    categoryImage,
    parentCategoryErpId,
    isHide,
    action,
  } = payload;

  if (!erpId) {
    throw new Error("erpId is required");
  }

  // DELETE
  if (action === "DELETE") {
    const deleted = await deleteCategoryByErpIdRepo(organizationId, erpId);
    return { action, erpId, deleted: !!deleted };
  }

  // UPSERT (default)
  const category = await upsertCategoryByErpIdRepo(
    organizationId,
    erpId,
    {
      label,
      value,
      categoryImage,
      parentCategoryErpId,
      isHide: isHide || false,
    }
  );

  return { action: action || "UPSERT", erpId, data: category };
};

module.exports = {
  syncCategoryFromErpService,
};
