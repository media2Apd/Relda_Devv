const {
  upsertCategoryByErpIdRepo,
  deleteCategoryByErpIdRepo,
} = require("../repositories/erpSyncCategoryRepo");

const syncCategoryFromErpService = async (organizationId, payload) => {
  const {
    erpId,
    id,
    _id,
    label,
    value,
    categoryImage,
    parentCategoryErpId,
    isHide,
    action,
  } = payload;
  const resolvedErpId = erpId || id || _id;

  if (!resolvedErpId) {
    throw new Error("erpId is required");
  }

  // DELETE
  if (action === "DELETE") {
    const deleted = await deleteCategoryByErpIdRepo(organizationId, resolvedErpId);
    return { action, erpId: resolvedErpId, deleted: !!deleted };
  }

  // UPSERT (default)
  const category = await upsertCategoryByErpIdRepo(
    organizationId,
    resolvedErpId,
    {
      label,
      value,
      categoryImage,
      parentCategoryErpId,
      isHide: isHide || false,
    }
  );

  return { action: action || "UPSERT", erpId: resolvedErpId, data: category };
};

module.exports = {
  syncCategoryFromErpService,
};
