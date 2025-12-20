const express = require('express')
const router = express.Router()
const  isAdmin  = require("../middleware/isAdmin");
const userSignUpController = require("../controller/user/userSignUp")
const {loginWithPasswordController, sendOtpController, verifyOtpController} = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const guestSession = require("../middleware/guestSession");
const authTokenOptional = require('../middleware/authTokenOptional')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const { forgetPassword, resetPassword } = require('../controller/user/forgetPassword')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const { addToCartController } = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const {addToCartViewProduct, addToCartViewAllProduct}  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const { submitComplaint, getAllcomplaints, getComplaintFile } = require('../controller/complaintController')
const reviewController = require('../controller/reviewController');
const { validateAddress } = require("../controller/addressController");
const {paymentController, verifyPayment, updateOrderStatus, CancelOrder, deletePendingOrderById } = require('../controller/order/paymentController')
const {  addParentCategory, getParentCategories, editParentCategory,deleteParentCategory, getActiveParentCategories } = require('../controller/product/ParentCategoryController')
const { returnOrder } = require('../controller/order/returnOrder')
const { sendCustomerSupportMessage, getAllMessages } = require('../controller/user/contactController');
const { upload, handleFormSubmission, getAllApplications, getApplicationFile } = require('../controller/applicationController');
const { registerProduct, getAllRegistrations, getRegFile } = require('../controller/product/registrationController');
const { submitApplication, getAlldealer, getDealerFile } = require('../controller/dealerController');
const webhooks = require('../controller/order/webhook')
const {orderController, viewOrderController} = require('../controller/order/order.controller')
const { addCategory, getCategories, editCategory, deleteCategory, getActiveCategories} = require("../controller/product/productCategoryController");

const   allOrderController = require('../controller/order/allOrder.controller')
const {sendContactusMessage, getusAllMessages} = require('../controller/user/contactusController')
const { updateUserController, getUserController } = require('../controller/user/updateUserProfile');
const  { applyForJob, allCareers, getCareerFile }  = require('../controller/user/CareerController');
const { acceptCookies, getAllCookieAcceptanceData } = require('../controller/cookieController');

// const { getSales } = require('../controller/dashboard/salesDataController')

const { getDashboardCounts } = require('../controller/dashboard/dashboardController');
const {getViewedProducts} = require('../controller/product/relatedProducts')

const addressController = require("../controller/user/addaddressController");
const { addOfferPoster, getAllOfferPosters, editOfferPoster, deleteOfferPoster, getOfferPosterById } = require('../controller/offerposter/offerPosterController');
const couponController = require("../controller/order/couponController");
const bannerUpload = require("../middleware/bannerUpload");
const bannerController = require("../controller/bannerPosts/bannerController");
const sitemapGenerator = require('../utils/sitemapGenerator');
const { createBlogPost, getAllBlogPosts, editBlogPost, deleteBlogPost, getBlogPostById } = require('../controller/blog/blogsController');
const { addDeveloperIP, removeDeveloperIP } = require('../controller/DeveloperIp');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controller/user/wishlistController');
const { storage } = require('../config/blogCloudinary');
const multer = require('multer');
const uploads = multer({ storage });
const blogImageUpload = require('../config/blogCloudinary')
router.post('/add-blog', blogImageUpload.single('image'), createBlogPost);
router.get('/get-blogs', getAllBlogPosts);
router.put('/update-blog/:id', blogImageUpload.single('image'), editBlogPost);
router.delete('/delete-blog/:id', deleteBlogPost);
router.get('/get-blog/:id', getBlogPostById);
router.get('/products/related', getViewedProducts)
router.post('/add-developerIp', addDeveloperIP);
router.delete('/delete-developerIp', removeDeveloperIP)

router.post('/add-offerposter', uploads.single('image'), addOfferPoster);
router.get('/get-offerposters', getAllOfferPosters);
router.put('/update-offerposter/:id', uploads.single('image', 5), editOfferPoster);
router.delete('/delete-offerposter/:id', deleteOfferPoster);
router.get('/get-offerposter/:id', getOfferPosterById);

router.get("/sitemap.xml", sitemapGenerator);

// Get all addresses
router.get("/allAddress", authToken, addressController.getAllAddresses);

// Add a new address
router.post("/addAddress", authToken, addressController.addAddress);

// Edit an existing address
router.put("/updateAddress/:addressId", authToken, addressController.updateAddress);

// Delete an address
router.delete("/addresses/:addressId", authToken, addressController.deleteAddress);

// Set an address as default
router.put("/setDefault/:addressId", authToken, addressController.setDefaultAddress);

// Route for career form submission
router.post('/career/apply', upload.single('resume'), applyForJob);
router.get('/career/allapplies',  allCareers)
router.get('/career/file/:id', getCareerFile)

router.put('/user/:userId', updateUserController);
router.get('/user/:userId', getUserController);

// router.post('/signup', profilePicUpload.single('profilePic'), userSignUpController);
router.post('/signup',userSignUpController)
router.post("/signin",loginWithPasswordController)
router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);

// router.post('/send-otp', sendOtpController); 
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)
router.post('/forget-password', forgetPassword)
router.post('/reset-password/:token',  resetPassword)
//admin panel 
router.get("/all-user", authToken,allUsers)
router.post("/update-user",authToken,updateUser)
// Define the route to handle cookie acceptance
router.post('/accept-cookies', acceptCookies);
router.get('/all-cookies', getAllCookieAcceptanceData)


router.post("/add-parent-category", addParentCategory);
router.get("/get-parent-categories", getParentCategories);
router.get("/get-active-parent-categories", getActiveParentCategories);
router.put("/edit-parent-category/:id", editParentCategory);
router.delete("/delete-parent-category/:id", deleteParentCategory);
//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)
router.post('/register', upload.single('fileUpload'), registerProduct);
router.get('/getreg', getAllRegistrations)
router.get('/getreg/file/:id', getRegFile);
router.post('/complaint',upload.single('fileUpload'), submitComplaint)
router.get('/getcomplaints', getAllcomplaints)
router.get('/getcomplaintFile/:id', getComplaintFile)

// Route to submit a review for a product
router.post('/review', authToken, reviewController.submitReview);

// Route to get all reviews for a specific product
router.get('/reviews', reviewController.getReviews);
router.post('/:userId/wishlist/:productId', addToWishlist);
router.delete('/:userId/wishlist/:productId', removeFromWishlist);
router.get('/:userId/wishlist', getWishlist);

//user add to cart
// router.post("/addtocart", authToken, addToCartController)
router.post("/addtocart", guestSession, authTokenOptional, addToCartController)
// router.get('/getCart', authToken, addToCartViewAllProduct)
router.get('/getCart', guestSession, authTokenOptional, addToCartViewAllProduct)
// router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/countAddToCartProduct",guestSession, authTokenOptional, countAddToCartProduct)
router.get("/view-card-product",authTokenOptional, guestSession, addToCartViewProduct)
router.post("/update-cart-product",authTokenOptional, guestSession, updateAddToCartProduct)
router.post("/delete-cart-product",authTokenOptional, guestSession, deleteAddToCartProduct)

router.post('/submit', sendContactusMessage);
router.get('/get-msg',getAllMessages);
router.post('/sub-cont', sendCustomerSupportMessage)
router.get('/getmsg', getusAllMessages)
router.post('/submit-application', upload.single('fileUpload'), handleFormSubmission);
router.get('/applications', getAllApplications);
router.get('/application/file/:id', getApplicationFile);
router.post('/submit-app', upload.single('fileUpload'), submitApplication);
router.get('/dealer', getAlldealer);
router.get('/dealer/file/:id', getDealerFile);

router.post("/validate-address", validateAddress);

//payment and order
router.post("/checkout", authToken, paymentController);
// router.post('/payment/redirect', redirectPayment);
// router.post('/payment/cancel', cancelPayment);
router.post('/update-order-status', updateOrderStatus);
// router.get('/search/:orderId', searchOrderById);
// router.get('/order', searchOrderById)
router.put('/cancel-order', authToken, CancelOrder);
// router.post('/returnOrder', upload.fields([{ name: 'returnImage', maxCount: 1 }, { name: 'anotherField', maxCount: 1 }]), authToken, returnOrder);
router.post('/return-order', authToken,returnOrder);
router.post("/ver-pay", authToken, verifyPayment)
router.post('/webhook',webhooks)
router.get("/order-list",authToken,orderController)
router.get("/view-one-order/:orderId",authToken,viewOrderController)
router.get("/all-order",authToken,allOrderController)
router.post("/add-product-categories", addCategory); 
router.get("/get-product-categories", getCategories); 
router.get("/get-active-product-categories", getActiveCategories);
router.put("/edit-product-categories/:id", editCategory); 
router.delete("/delete-product-categories/:id", deleteCategory); 
router.get("/dashboard", getDashboardCounts)
router.delete("/delete-order", authToken, deletePendingOrderById)
router.post("/create-coupon", couponController.createCoupon);
router.get("/all-coupons", couponController.getAllCoupons);
router.get("/view-coupon/:id", couponController.getCouponById);
router.put("/update-coupon/:id", couponController.updateCoupon);
router.delete("/delete-coupon/:id", couponController.deleteCoupon);
router.patch("/toggle-coupon-status/:id", couponController.toggleCouponStatus);

router.post(
  "/banner/upload",
  bannerUpload.fields([
    { name: "desktop", maxCount: 1 },
    { name: "mobile", maxCount: 1 }
  ]),
  bannerController.createBanner
);

// FRONTEND GET BANNERS
router.get("/banner/view-all", bannerController.getBanners);

// router.get('/sales/:period', getSales)

module.exports = router;


