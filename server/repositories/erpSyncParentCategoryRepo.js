const ParentCategory = require("../models/parentCategoryModel");

const upsertParentCategoryByErpIdRepo = async (organizationId, erpId, data) => {
  const query = organizationId ? { erpId, organizationId } : { erpId };

  return await ParentCategory.findOneAndUpdate(
    query,
    {
      $set: {
        ...data,
        erpId,
        organizationId,
        source: "ERP",
        lastSyncedAt: new Date(),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const deleteParentCategoryByErpIdRepo = async (organizationId, erpId) => {
  const query = organizationId ? { erpId, organizationId } : { erpId };
  return await ParentCategory.findOneAndDelete(query);
};

module.exports = {
  upsertParentCategoryByErpIdRepo,
  deleteParentCategoryByErpIdRepo,
};
