const {
  upsertParentCategoryByErpIdRepo,
  deleteParentCategoryByErpIdRepo,
} = require("../repositories/erpSyncParentCategoryRepo.js");

const syncParentCategoryFromErpService = async (organizationId, payload) => {
  const { erpId, id, _id, name, categoryImage, isHide, action } = payload;
  const resolvedErpId = erpId || id || _id;

  if (!resolvedErpId) {
    throw new Error("erpId is required");
  }

  // DELETE
  if (action === "DELETE") {
    const deleted = await deleteParentCategoryByErpIdRepo(organizationId, resolvedErpId);
    return { action, erpId: resolvedErpId, deleted: !!deleted };
  }

  // UPSERT (default)
  const category = await upsertParentCategoryByErpIdRepo(
    organizationId,
    resolvedErpId,
    {
      name,
      categoryImage,
      isHide: isHide || false,
    }
  );

  return { action: action || "UPSERT", erpId: resolvedErpId, data: category };
};

module.exports = {
  syncParentCategoryFromErpService,
};
