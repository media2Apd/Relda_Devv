const Banner = require("../../models/banner");
const cloudinary = require("../../config/cloudinary");

// CREATE BANNER (ADMIN)
exports.createBanner = async (req, res) => {
  try {
    const { title, link, order } = req.body;

    if (!req.files || !req.files.desktop || !req.files.mobile) {
      return res.status(400).json({
        success: false,
        message: "Desktop and Mobile images required"
      });
    }

    const desktopResult = await cloudinary.uploader.upload(
      req.files.desktop[0].path,
      { folder: "banners/desktop" }
    );

    const mobileResult = await cloudinary.uploader.upload(
      req.files.mobile[0].path,
      { folder: "banners/mobile" }
    );

    const banner = new Banner({
      desktopImage: desktopResult.secure_url,
      mobileImage: mobileResult.secure_url,
      title,
      link,
      order
    });

    await banner.save();

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ACTIVE BANNERS (FRONTEND)
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });

    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ACTIVE BANNERS (ADMIN)
exports.getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find(
      { isActive: true },
      "desktopImage mobileImage link order" // 👈 only needed fields
    )
      .sort({ order: 1 })
      .lean(); // ⚡ fastest (no mongoose wrapper)

    res.json({
      success: true,
      data: banners
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------
   VIEW ONE BANNER (BY ID)
---------------------------------- */
exports.getOneBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id).lean();

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    res.json({
      success: true,
      data: banner
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------
   TOGGLE BANNER (ON / OFF)
---------------------------------- */
exports.toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.json({
      success: true,
      message: "Banner status updated",
      isActive: banner.isActive
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};