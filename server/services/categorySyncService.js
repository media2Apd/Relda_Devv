const erpApiService = require('./erpApiService');
const ParentCategory = require('../models/parentCategoryModel');
const Category = require('../models/productCategory');
const slugify = require('slugify');
const mongoose = require('mongoose');

// Generate slug
const generateSlug = (text) => {
  return slugify(text, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: true,
    locale: 'en',
    trim: true
  });
};

// Generate unique slug with counter if needed
const generateUniqueSlug = async (text, model, excludeId = null) => {
  let slug = generateSlug(text);
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const query = { slug: uniqueSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await model.findOne(query);
    if (!existing) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

// Sync parent categories from ERP
const syncParentCategories = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const results = {
    total: 0,
    synced: 0,
    created: 0,
    updated: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  try {
    console.log('Fetching parent categories from ERP...');
    const response = await erpApiService.getParentCategories();
    
    if (!response.success || !response.data) {
      throw new Error('Invalid response from ERP API');
    }

    const erpParentCategories = Array.isArray(response.data) ? response.data : [response.data];
    results.total = erpParentCategories.length;

    console.log(`Found ${results.total} parent categories in ERP`);

    for (const erpCategory of erpParentCategories) {
      try {
        // Skip hidden categories
        if (erpCategory.isHide === true) {
          results.skipped++;
          console.log(`Skipping hidden category: ${erpCategory.name}`);
          continue;
        }

        // Check if category exists
        const existingCategory = await ParentCategory.findOne({ 
          erpId: erpCategory._id || erpCategory.id 
        }).session(session);

        const slug = await generateUniqueSlug(
          erpCategory.name, 
          ParentCategory,
          existingCategory?._id
        );

        const categoryData = {
          name: erpCategory.name,
          slug: slug,
          categoryImage: erpCategory.categoryImage || '',
          description: erpCategory.description || '',
          isActive: !erpCategory.isHide,
          erpId: erpCategory._id || erpCategory.id,
          erpSyncData: {
            lastSyncedAt: new Date(),
            syncStatus: 'synced',
            syncError: null,
            erpLastModified: erpCategory.updatedAt || erpCategory.lastModified
          },
          metaTitle: erpCategory.name,
          metaDescription: erpCategory.description || `Browse ${erpCategory.name} products`,
          displayOrder: erpCategory.displayOrder || 0
        };

        if (existingCategory) {
          // Update existing category
          await ParentCategory.findByIdAndUpdate(
            existingCategory._id,
            categoryData,
            { session, new: true }
          );
          results.updated++;
          console.log(`Updated parent category: ${erpCategory.name}`);
        } else {
          // Create new category
          await ParentCategory.create([categoryData], { session });
          results.created++;
          console.log(`Created parent category: ${erpCategory.name}`);
        }

        results.synced++;

      } catch (error) {
        results.failed++;
        results.errors.push({
          category: erpCategory.name,
          erpId: erpCategory._id || erpCategory.id,
          error: error.message
        });
        console.error(`Failed to sync parent category ${erpCategory.name}:`, error.message);
      }
    }

    await session.commitTransaction();
    console.log('Parent categories sync completed:', results);
    return results;

  } catch (error) {
    await session.abortTransaction();
    console.error('Parent categories sync failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

// Sync categories from ERP
const syncCategories = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const results = {
    total: 0,
    synced: 0,
    created: 0,
    updated: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  try {
    console.log('Fetching categories from ERP...');
    const response = await erpApiService.getCategories();
    
    if (!response.success || !response.data) {
      throw new Error('Invalid response from ERP API');
    }

    const erpCategories = Array.isArray(response.data) ? response.data : [response.data];
    results.total = erpCategories.length;

    console.log(`Found ${results.total} categories in ERP`);

    // Create a map of ERP parent IDs to local parent IDs
    const parentCategoryMap = new Map();
    const allParentCategories = await ParentCategory.find({ erpId: { $exists: true } });
    allParentCategories.forEach(pc => {
      parentCategoryMap.set(pc.erpId, pc._id);
    });

    for (const erpCategory of erpCategories) {
      try {
        // Skip hidden categories
        if (erpCategory.isHide === true) {
          results.skipped++;
          console.log(`Skipping hidden category: ${erpCategory.label}`);
          continue;
        }

        // Find parent category if exists
        let parentCategoryId = null;
        if (erpCategory.parentCategory) {
          parentCategoryId = parentCategoryMap.get(erpCategory.parentCategory);
          if (!parentCategoryId) {
            console.warn(`Parent category not found for ${erpCategory.label}, parentId: ${erpCategory.parentCategory}`);
          }
        }

        // Check if category exists
        const existingCategory = await Category.findOne({ 
          erpId: erpCategory._id || erpCategory.id 
        }).session(session);

        const slug = await generateUniqueSlug(
          erpCategory.value || erpCategory.label,
          Category,
          existingCategory?._id
        );

        const categoryData = {
          name: erpCategory.label,
          slug: slug,
          categoryImage: erpCategory.categoryImage || '',
          description: erpCategory.description || '',
          parentCategory: parentCategoryId,
          isActive: !erpCategory.isHide,
          isFeatured: erpCategory.isFeatured || false,
          erpId: erpCategory._id || erpCategory.id,
          erpParentId: erpCategory.parentCategory || null,
          erpSyncData: {
            lastSyncedAt: new Date(),
            syncStatus: 'synced',
            syncError: null,
            erpLastModified: erpCategory.updatedAt || erpCategory.lastModified
          },
          metaTitle: erpCategory.label,
          metaDescription: erpCategory.description || `Browse ${erpCategory.label} products`,
          displayOrder: erpCategory.displayOrder || 0
        };

        if (existingCategory) {
          // Update existing category
          await Category.findByIdAndUpdate(
            existingCategory._id,
            categoryData,
            { session, new: true }
          );
          results.updated++;
          console.log(`Updated category: ${erpCategory.label}`);
        } else {
          // Create new category
          await Category.create([categoryData], { session });
          results.created++;
          console.log(`Created category: ${erpCategory.label}`);
        }

        results.synced++;

      } catch (error) {
        results.failed++;
        results.errors.push({
          category: erpCategory.label,
          erpId: erpCategory._id || erpCategory.id,
          error: error.message
        });
        console.error(`Failed to sync category ${erpCategory.label}:`, error.message);
      }
    }

    await session.commitTransaction();
    console.log('Categories sync completed:', results);
    return results;

  } catch (error) {
    await session.abortTransaction();
    console.error('Categories sync failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

// Full sync - parent categories first, then categories
const fullSync = async () => {
  const startTime = Date.now();
  const results = {
    status: 'completed',
    startedAt: new Date(startTime),
    completedAt: null,
    duration: null,
    parentCategories: null,
    categories: null,
    summary: {
      totalSynced: 0,
      totalFailed: 0,
      totalSkipped: 0
    }
  };

  try {
    // Step 1: Sync parent categories
    console.log('=== Starting Parent Categories Sync ===');
    results.parentCategories = await syncParentCategories();
    
    // Step 2: Sync categories
    console.log('=== Starting Categories Sync ===');
    results.categories = await syncCategories();

    // Calculate summary
    results.summary.totalSynced = 
      (results.parentCategories?.synced || 0) + 
      (results.categories?.synced || 0);
    
    results.summary.totalFailed = 
      (results.parentCategories?.failed || 0) + 
      (results.categories?.failed || 0);
    
    results.summary.totalSkipped = 
      (results.parentCategories?.skipped || 0) + 
      (results.categories?.skipped || 0);

    const endTime = Date.now();
    results.completedAt = new Date(endTime);
    results.duration = `${(endTime - startTime) / 1000} seconds`;

    console.log('=== Full Sync Completed ===');
    console.log(results.summary);

    return results;

  } catch (error) {
    results.status = 'failed';
    results.error = error.message;
    
    const endTime = Date.now();
    results.completedAt = new Date(endTime);
    results.duration = `${(endTime - startTime) / 1000} seconds`;
    
    console.error('Full sync failed:', error);
    throw error;
  }
};

// Get sync status
const getSyncStatus = async () => {
  const [parentCategoriesCount, categoriesCount, lastSyncedParent, lastSyncedCategory] = await Promise.all([
    ParentCategory.countDocuments(),
    Category.countDocuments(),
    ParentCategory.findOne().sort({ 'erpSyncData.lastSyncedAt': -1 }).select('erpSyncData.lastSyncedAt'),
    Category.findOne().sort({ 'erpSyncData.lastSyncedAt': -1 }).select('erpSyncData.lastSyncedAt')
  ]);

  const syncedParentCount = await ParentCategory.countDocuments({ 'erpSyncData.syncStatus': 'synced' });
  const syncedCategoryCount = await Category.countDocuments({ 'erpSyncData.syncStatus': 'synced' });
  const failedParentCount = await ParentCategory.countDocuments({ 'erpSyncData.syncStatus': 'failed' });
  const failedCategoryCount = await Category.countDocuments({ 'erpSyncData.syncStatus': 'failed' });

  return {
    parentCategories: {
      total: parentCategoriesCount,
      synced: syncedParentCount,
      failed: failedParentCount,
      pending: parentCategoriesCount - syncedParentCount - failedParentCount,
      lastSyncedAt: lastSyncedParent?.erpSyncData?.lastSyncedAt || null
    },
    categories: {
      total: categoriesCount,
      synced: syncedCategoryCount,
      failed: failedCategoryCount,
      pending: categoriesCount - syncedCategoryCount - failedCategoryCount,
      lastSyncedAt: lastSyncedCategory?.erpSyncData?.lastSyncedAt || null
    },
    lastFullSync: lastSyncedParent?.erpSyncData?.lastSyncedAt || lastSyncedCategory?.erpSyncData?.lastSyncedAt || null
  };
};

// Clean orphaned categories
const cleanOrphanedCategories = async () => {
  const orphanedCategories = await Category.find({
    parentCategory: { $ne: null },
    $or: [
      { parentCategory: { $exists: false } },
      { erpParentId: { $exists: true, $ne: null } }
    ]
  });

  const results = {
    found: orphanedCategories.length,
    fixed: 0,
    removed: 0
  };

  for (const category of orphanedCategories) {
    if (category.erpParentId) {
      // Try to find and link parent
      const parent = await ParentCategory.findOne({ erpId: category.erpParentId });
      if (parent) {
        category.parentCategory = parent._id;
        await category.save();
        results.fixed++;
      } else {
        // Remove parent reference if parent doesn't exist
        category.parentCategory = null;
        await category.save();
        results.removed++;
      }
    }
  }

  return results;
};

module.exports = {
  syncParentCategories,
  syncCategories,
  fullSync,
  getSyncStatus,
  cleanOrphanedCategories
};
