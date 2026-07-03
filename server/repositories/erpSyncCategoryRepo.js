const ProductCategory = require("../models/productCategory");
const ParentCategory = require("../models/parentCategoryModel");

const upsertCategoryByErpIdRepo = async (organizationId, erpId, data) => {
  // parentCategoryErpId irundhaa, website-la iruka ObjectId la resolve pannu
  let parentObjectId = null;
  if (data.parentCategoryErpId) {
    const parent = await ParentCategory.findOne({
      erpId: data.parentCategoryErpId,
      organizationId,
    });
    parentObjectId = parent ? parent._id : null;
  }

  const { parentCategoryErpId, ...rest } = data;

  return await ProductCategory.findOneAndUpdate(
    { erpId, organizationId },
    {
      $set: {
        ...rest,
        parentCategory: parentObjectId,
        erpId,
        source: "ERP",
        lastSyncedAt: new Date(),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const deleteCategoryByErpIdRepo = async (organizationId, erpId) => {
  return await ProductCategory.findOneAndDelete({ erpId, organizationId });
};

module.exports = {
  upsertCategoryByErpIdRepo,
  deleteCategoryByErpIdRepo,
};
