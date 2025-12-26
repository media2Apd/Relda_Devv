const ParentCategory = require("../../models/parentCategoryModel");
const ProductCategory = require("../../models/productCategory");

/**
 * GET ALL ACTIVE PARENT CATEGORIES WITH SUB CATEGORIES
 */
exports.getActiveCategoriesTree = async (req, res) => {
  try {
    // 1️⃣ Fetch active parent categories
    const parents = await ParentCategory.find({ isHide: false })
      .select("_id name")
      .sort({ createdAt: 1 });

    // 2️⃣ Fetch active sub categories
    const subCategories = await ProductCategory.find({ isHide: false })
      .select("_id value parentCategory");

    // 3️⃣ Map parent → subCategories
    const result = parents.map(parent => ({
      _id: parent._id,
      name: parent.name,
      isHide: false,
      subCategories: subCategories
        .filter(sub => sub.parentCategory.toString() === parent._id.toString())
        .map(sub => ({
          _id: sub._id,
          name: sub.value,
          isHide: false
        }))
    }));

    return res.json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (error) {
    console.error("Category tree error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};
