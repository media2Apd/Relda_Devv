// const Banner = require("../../models/bannerModel");
// const cloudinary = require("../../config/cloudinary");

// // CREATE BANNER (ADMIN)
// exports.createBanner = async (req, res) => {
//   try {
//     const { title, link, order } = req.body;

//     if (!req.files || !req.files.desktop || !req.files.mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "Desktop and Mobile images required"
//       });
//     }

//     const desktopResult = await cloudinary.uploader.upload(
//       req.files.desktop[0].path,
//       { folder: "banners/desktop" }
//     );

//     const mobileResult = await cloudinary.uploader.upload(
//       req.files.mobile[0].path,
//       { folder: "banners/mobile" }
//     );

//     const banner = new Banner({
//       desktopImage: desktopResult.secure_url,
//       mobileImage: mobileResult.secure_url,
//       title,
//       link,
//       order
//     });

//     await banner.save();

//     res.status(201).json({
//       success: true,
//       message: "Banner created successfully",
//       data: banner
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // GET ACTIVE BANNERS (FRONTEND)
// exports.getBanners = async (req, res) => {
//   try {
//     const banners = await Banner.find({ isActive: true }).sort({ order: 1 });

//     res.json({
//       success: true,
//       data: banners
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // GET ACTIVE BANNERS (ADMIN)
// exports.getActiveBanners = async (req, res) => {
//   try {
//     const banners = await Banner.find(
//       { isActive: true },
//       "desktopImage mobileImage link order" // 👈 only needed fields
//     )
//       .sort({ order: 1 })
//       .lean(); // ⚡ fastest (no mongoose wrapper)

//     res.json({
//       success: true,
//       data: banners
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ----------------------------------
//    VIEW ONE BANNER (BY ID)
// ---------------------------------- */
// exports.getOneBanner = async (req, res) => {
//   try {
//     const banner = await Banner.findById(req.params.id).lean();

//     if (!banner) {
//       return res.status(404).json({
//         success: false,
//         message: "Banner not found"
//       });
//     }

//     res.json({
//       success: true,
//       data: banner
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* ----------------------------------
//    TOGGLE BANNER (ON / OFF)
// ---------------------------------- */
// exports.toggleBanner = async (req, res) => {
//   try {
//     const banner = await Banner.findById(req.params.id);

//     if (!banner) {
//       return res.status(404).json({
//         success: false,
//         message: "Banner not found"
//       });
//     }

//     banner.isActive = !banner.isActive;
//     await banner.save();

//     res.json({
//       success: true,
//       message: "Banner status updated",
//       isActive: banner.isActive
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



const Banner = require("../../models/bannerModel");
const cloudinary = require("../../config/cloudinary");

/* CREATE BANNER (ADMIN) */
exports.createBanner = async (req, res) => {
  try {
    const { title, link, order, position } = req.body;

    if (!req.files?.desktop || !req.files?.mobile) {
      return res.status(400).json({
        success: false,
        message: "Desktop and Mobile images are required"
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

    const banner = await Banner.create({
      title,
      link,
      position, // home-top | home-bottom
      order,
      desktopImage: desktopResult.secure_url,
      mobileImage: mobileResult.secure_url
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET BANNERS (FRONTEND) */
exports.getBanners = async (req, res) => {
  try {
    const { position } = req.query;

    const banners = await Banner.find({
      isActive: true,
      ...(position && { position })
    })
      .sort({ order: 1 })
      .lean();

    res.json({
      success: true,
      data: banners
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET ACTIVE BANNERS (ADMIN) */
// exports.getActiveBanners = async (req, res) => {
//   try {
//     const banners = await Banner.find()
//       .sort({ order: 1 })
//       .lean();

//     res.json({
//       success: true,
//       data: banners
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

exports.getActiveBanners = async (req, res) => {
  const banners = await Banner.find()
    .sort({ position: 1, order: 1 }) // ✅ IMPORTANT
    .lean();

  res.json({ success: true, data: banners });
};

/* GET ONE BANNER */
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

/* UPDATE BANNER */
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    const { title, link, order, position } = req.body;

    if (req.files?.desktop) {
      const desktopResult = await cloudinary.uploader.upload(
        req.files.desktop[0].path,
        { folder: "banners/desktop" }
      );
      banner.desktopImage = desktopResult.secure_url;
    }

    if (req.files?.mobile) {
      const mobileResult = await cloudinary.uploader.upload(
        req.files.mobile[0].path,
        { folder: "banners/mobile" }
      );
      banner.mobileImage = mobileResult.secure_url;
    }

    banner.title = title ?? banner.title;
    banner.link = link ?? banner.link;
    banner.order = order ?? banner.order;
    banner.position = position ?? banner.position;

    await banner.save();

    res.json({
      success: true,
      message: "Banner updated successfully",
      data: banner
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/*  TOGGLE BANNER */
exports.toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
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

/* DELETE BANNER */
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Banner deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// exports.reorderBanners = async (req, res) => {
//   const { orders } = req.body;

//   for (const item of orders) {
//     await Banner.findByIdAndUpdate(item.id, {
//       order: item.order
//     });
//   }

//   res.json({ success: true });
// };

exports.reorderBanners = async (req, res) => {
  const { position, orders } = req.body;

  if (!position || !orders?.length) {
    return res.status(400).json({ success: false });
  }

  const bulkOps = orders.map(item => ({
    updateOne: {
      filter: { _id: item.id, position },
      update: { order: item.order }
    }
  }));

  await Banner.bulkWrite(bulkOps);

  res.json({ success: true });
};
