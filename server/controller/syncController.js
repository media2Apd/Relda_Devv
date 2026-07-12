const categorySyncService = require('../services/categorySyncService');
const erpApiService = require('../services/erpApiService');

// Full sync - both parent categories and categories
const syncAll = async (req, res) => {
  try {
    console.log('Starting full category sync...');
    const results = await categorySyncService.fullSync();
    
    res.status(200).json({
      success: true,
      message: 'Categories synced successfully',
      data: results
    });
  } catch (error) {
    console.error('Sync failed:', error);
    res.status(500).json({
      success: false,
      message: 'Category sync failed',
      error: error.message
    });
  }
};

// Sync only parent categories
const syncParentCategories = async (req, res) => {
  try {
    console.log('Starting parent categories sync...');
    const results = await categorySyncService.syncParentCategories();
    
    res.status(200).json({
      success: true,
      message: 'Parent categories synced successfully',
      data: results
    });
  } catch (error) {
    console.error('Parent categories sync failed:', error);
    res.status(500).json({
      success: false,
      message: 'Parent categories sync failed',
      error: error.message
    });
  }
};

// Sync only categories
const syncCategories = async (req, res) => {
  try {
    console.log('Starting categories sync...');
    const results = await categorySyncService.syncCategories();
    
    res.status(200).json({
      success: true,
      message: 'Categories synced successfully',
      data: results
    });
  } catch (error) {
    console.error('Categories sync failed:', error);
    res.status(500).json({
      success: false,
      message: 'Categories sync failed',
      error: error.message
    });
  }
};

// Get sync status
const getSyncStatus = async (req, res) => {
  try {
    const status = await categorySyncService.getSyncStatus();
    
    res.status(200).json({
      success: true,
      message: 'Sync status retrieved successfully',
      data: status
    });
  } catch (error) {
    console.error('Failed to get sync status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sync status',
      error: error.message
    });
  }
};

// Clean orphaned categories
const cleanOrphanedCategories = async (req, res) => {
  try {
    const results = await categorySyncService.cleanOrphanedCategories();
    
    res.status(200).json({
      success: true,
      message: 'Orphaned categories cleaned successfully',
      data: results
    });
  } catch (error) {
    console.error('Failed to clean orphaned categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clean orphaned categories',
      error: error.message
    });
  }
};

// Test ERP connection
const testErpConnection = async (req, res) => {
  try {
    const health = await erpApiService.healthCheck();
    
    res.status(200).json({
      success: true,
      message: 'ERP connection test completed',
      data: health
    });
  } catch (error) {
    console.error('ERP connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'ERP connection test failed',
      error: error.message
    });
  }
};

module.exports = {
  syncAll,
  syncParentCategories,
  syncCategories,
  getSyncStatus,
  cleanOrphanedCategories,
  testErpConnection
};
