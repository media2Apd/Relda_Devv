const ParentCategory = require("../models/parentCategoryModel");

const upsertParentCategoryByErpIdRepo = async (organizationId, erpId, data) => {
  return await ParentCategory.findOneAndUpdate(
    { erpId, organizationId },
    {
      $set: {
        ...data,
        erpId,
        source: "ERP",
        lastSyncedAt: new Date(),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const deleteParentCategoryByErpIdRepo = async (organizationId, erpId) => {
  return await ParentCategory.findOneAndDelete({ erpId, organizationId });
};

module.exports = {
  upsertParentCategoryByErpIdRepo,
  deleteParentCategoryByErpIdRepo,
};
