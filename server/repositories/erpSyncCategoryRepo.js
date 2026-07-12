const ProductCategory = require("../models/productCategory");
const ParentCategory = require("../models/parentCategoryModel");

const upsertCategoryByErpIdRepo = async (organizationId, erpId, data) => {
  let parentObjectId = null;

  if (data.parentCategoryErpId) {
    const parentQuery = organizationId
      ? { erpId: data.parentCategoryErpId, organizationId }
      : { erpId: data.parentCategoryErpId };

    const parent = await ParentCategory.findOne(parentQuery);
    parentObjectId = parent ? parent._id : null;
  }

  const { parentCategoryErpId, ...rest } = data;
  const query = organizationId ? { erpId, organizationId } : { erpId };

  return await ProductCategory.findOneAndUpdate(
    query,
    {
      $set: {
        ...rest,
        parentCategory: parentObjectId,
        erpId,
        organizationId,
        source: "ERP",
        lastSyncedAt: new Date(),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const deleteCategoryByErpIdRepo = async (organizationId, erpId) => {
  const query = organizationId ? { erpId, organizationId } : { erpId };
  return await ProductCategory.findOneAndDelete(query);
};

module.exports = {
  upsertCategoryByErpIdRepo,
  deleteCategoryByErpIdRepo,
};
