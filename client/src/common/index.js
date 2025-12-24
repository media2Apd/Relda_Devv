const backendDomain = "http://localhost:8080";
// const backendDomain =  "https://www.reldaindia.com" ; 

const SummaryApi = {
    signUP: {
        url: `${backendDomain}/api/signup`,
        method: "post"
    },
    signIn: {
        url: `${backendDomain}/api/signin`,
        method: "post"
    },

    sendOtp: {
        url: `${backendDomain}/api/send-otp`,
        method: "post"
    },

    verifyOtp: {
        url: `${backendDomain}/api/verify-otp`,
        method: "post"
    },

    current_user: {
        url: `${backendDomain}/api/user-details`,
        method: "get"
    },
    logout_user: {
        url: `${backendDomain}/api/userLogout`,
        method: 'get'
    },
    allUser: {
        url: `${backendDomain}/api/all-user`,
        method: 'get'
    },
    updateUser: {
        url: `${backendDomain}/api/update-user`,
        method: "post"
    },
    updateUserDetails: {
        url: `${backendDomain}/api/user/:userId`,
        method: "put"
    },
    uploadProduct: {
        url: `${backendDomain}/api/upload-product`,
        method: 'post'
    },
    allProduct: {
        url: `${backendDomain}/api/get-product`,
        method: 'get'
    },
    updateProduct: {
        url: `${backendDomain}/api/update-product`,
        method: 'post'
    },
    categoryProduct: {
        url: `${backendDomain}/api/get-categoryProduct`,
        method: 'get'
    },
    categoryWiseProduct: {
        url: `${backendDomain}/api/category-product`,
        method: 'post'
    },
    productDetails: {
        url: `${backendDomain}/api/product-details`,
        method: 'post'
    },
    addToCartProduct: {
        url: `${backendDomain}/api/addtocart`,
        method: 'post'
    },
    addToCartProductCount: {
        url: `${backendDomain}/api/countAddToCartProduct`,
        method: 'get'
    },
    addToCartProductView: {
        url: `${backendDomain}/api/view-card-product`,
        method: 'get'
    },
    updateCartProduct: {
        url: `${backendDomain}/api/update-cart-product`,
        method: 'post'
    },
    deleteCartProduct: {
        url: `${backendDomain}/api/delete-cart-product`,
        method: 'post'
    },
    searchProduct: {
        url: `${backendDomain}/api/search`,
        method: 'get'
    },
    filterProduct: {
        url: `${backendDomain}/api/filter-product`,
        method: 'post'
    },
    contactUs: {
        url: `${backendDomain}/api/submit`,
        method: 'post'
    },
    payment: {
        url: `${backendDomain}/api/checkout`,
        method: 'post'
    },
    verpay: {
        url: `${backendDomain}/api/ver-pay`,
        method: 'post'
    },
    authourisedServiceCentre: {
        url: `${backendDomain}/api/submit-application`,
        method: 'post'
    },
    getAllApplications: {
        url: `${backendDomain}/api/applications`,
        method: 'get'
    },
    ProductRegistration: {
        url: `${backendDomain}/api/register`,
        method: 'post'
    },
    GetRegistrations: {
        url: `${backendDomain}/api/getreg`,
        method: 'get'
    },
    authorisedDealer: {
        url: `${backendDomain}/api/submit-app`,
        method: 'post'
    },
    getDealer: {
        url: `${backendDomain}/api/dealer`,
        method: 'get'
    },
    upload: {
        url: `${backendDomain}/uploads`
    },
    getOrder: {
        url: `${backendDomain}/api/order-list`,
        method: 'get'
    },
    viewOneOrder: {
        url: `${backendDomain}/api/view-one-order`,
        method: 'get'
    },
    returnOrder: {
        url: `${backendDomain}/api/return-order`,
        method: 'post'
    },
    viewReturnImages: (orderId) => ({
        url: `${backendDomain}/api/return-order-images/${orderId}`,
        method: 'get'
    }),
    allOrder: {
        url: `${backendDomain}/api/all-order`,
        method: 'get'
    },
    allmsg: {
        url: `${backendDomain}/api/get-msg`,
        method: 'get'
    },
    customerSupport: {
        url: `${backendDomain}/api/sub-cont`,
        method: 'post'
    },
    complaints: {
        url: `${backendDomain}/api/getcomplaints`,
        method: 'get'
    },
    allcont: {
        url: `${backendDomain}/api/getmsg`,
        method: 'get'
    },
    career: {
        url: `${backendDomain}/api/career/apply`,
        method: 'post'
    },
    allCareer: {
        url: `${backendDomain}/api/career/allapplies`,
        method: 'get'
    },
    viewCareerFile: {
        url: (careerId) => `${backendDomain}/api/career/file/${careerId}`,
        method: 'GET'
    },
    UserUpdate: {
        url: (userId) => `${backendDomain}/api/user/${userId}`,
        method: 'PUT'
    },
    viewuser: {
        url: (userId) => `${backendDomain}/api/user/${userId}`,
        method: 'GET'
    },
    viewApplicationFile: (applicationId) => ({
        url: `${backendDomain}/api/application/file/${applicationId}`,
        method: 'get'
    }),
    viewDealerFile: (dealerId) => ({
        url: `${backendDomain}/api/dealer/file/${dealerId}`,
        method: 'get'
    }),
    viewRegistrationFile: (registrationId) => ({
        url: `${backendDomain}/api/getreg/file/${registrationId}`,
        method: 'get'
    }),
    viewComplaintFile: (complaintId) => ({
        url: `${backendDomain}/api/getcomplaintFile/${complaintId}`,
        method: 'get'
    }),
    cookies: {
        url: `${backendDomain}/api/accept-cookies`,
        method: 'POST'
    },
    updateOrderStatus: {
        url: `${backendDomain}/api/update-order-status`,
        method: 'POST'
    },
    searchOrder: (orderId) => ({
        url: `${backendDomain}/api/search/${orderId}`,
        method: 'get'
    }),
    complaintSupport: {
        url: `${backendDomain}/api/complaint`,
        method: 'POST'
    },
    CancelOrder: {
        url: `${backendDomain}/api/cancel-order`,
        method: 'PUT'
    },
    getProductReviews: {
        url: `${backendDomain}/api/reviews`,
        method: 'GET',
    },

    submitReview: {
        url: `${backendDomain}/api/review`,
        method: 'POST',
    },
    getAddressList: {
        url: `${backendDomain}/api/allAddress`,
        method: 'GET',
    },
    addAddress: {
        url: `${backendDomain}/api/addAddress`,
        method: 'POST',
    },
    updateAddress: {
        url: `${backendDomain}/api/updateAddress`,
        method: 'PUT',
    },
    deleteAddress: {
        url: `${backendDomain}/api/addresses`,
        method: 'DELETE',
    },
    setDefaultAddress: {
        url: `${backendDomain}/api/setDefault`,
        method: 'PUT',
    },
    addProductCategory: {
        url: `${backendDomain}/api/add-product-categories`,
        method: 'post',
    },

    editProductCategory: {
        url: `${backendDomain}/api/edit-product-categories/:id`,
        method: 'put',
    },

    getProductCategory: {
        url: `${backendDomain}/api/get-product-categories`,
        method: 'get',
    },

    getActiveProductCategory: {
        url: `${backendDomain}/api/get-active-product-categories`,
        method: 'get',
    },

    deleteProductCategory: {
        url: `${backendDomain}/api/delete-product-categories/:id`,
        method: 'delete',
    },
    getDashboard: {
        url: `${backendDomain}/api/dashboard`,
        method: 'get',
    },
    allCart: {
        url: `${backendDomain}/api/getCart`,
        method: 'get'
    },
    deleteOrder: {
        url: `${backendDomain}/api/delete-order`,
        method: 'delete'
    },
    allCookies: {
        url: `${backendDomain}/api/all-cookies`
    },
    AddParentCategory: {
        url: `${backendDomain}/api/add-parent-category`,
        method: 'post'
    },
    editParentCategory: {
        url: `${backendDomain}/api/edit-parent-category/:id`,
        method: 'put'
    },
    deleteParentCategory: {
        url: `${backendDomain}/api/delete-parent-category/:id`,
        method: 'delete'
    },
    getParentCategories: {
        url: `${backendDomain}/api/get-parent-categories`,
        method: 'get'
    },
    getActiveParentCategories: {
        url: `${backendDomain}/api/get-active-parent-categories`,
        method: 'get'
    },
    UploadBlog: {
        url: `${backendDomain}/api/add-blog`,
        method: 'post'
    },
    getBlogs: {
        url: `${backendDomain}/api/get-blogs`,
        method: 'get'
    },
    getOneBlog: (id) => {
        return {
            url: `${backendDomain}/api/get-blog/${id}`,
            method: 'get'
        }
    },
    updateBlog: (id) => {
        return {
            url: `${backendDomain}/api/update-blog/${id}`,
            method: 'PUT'
        }
    },
    deleteBlog: (id) => {
        return {
            url: `${backendDomain}/api/delete-blog/${id}`,
            method: 'delete'
        }
    },
    UploadOfferPoster: {
        url: `${backendDomain}/api/add-offerposter`,
        method: 'post'
    },
    getOfferPosters: {
        url: `${backendDomain}/api/get-offerposters`,
        method: 'get'
    },
    getOneOfferPoster: (id) => {
        return {
            url: `${backendDomain}/api/get-offerposter/${id}`,
            method: 'get'
        }
    },
    updateOfferPoster: (id) => {
        return {
            url: `${backendDomain}/api/update-offerposter/${id}`,
            method: 'PUT'
        }
    },
    deleteOfferPoster: (id) => {
        return {
            url: `${backendDomain}/api/delete-offerposter/${id}`,
            method: 'delete'
        }
    },
    relatedProducts: (viewed) => {
        return {
            url: `${backendDomain}/api/products/related?ids=${viewed.join(",")}`,
            method: 'get'
        }
    },
    wishlistAddRemove: (userId, productId) => {
        return {
            url: `${backendDomain}/api/${userId}/wishlist/${productId}`,
            method: 'post'
        }
    },
    getWishlist: (userId) => {
        return {
            url: `${backendDomain}/api/${userId}/wishlist`,
            method: 'get'
        }
    },
    forgotPassword: {
        url: `${backendDomain}/api/forget-password`,
        method: 'post'
    },
    resetPassword: (token) => {
        return {
            url: `${backendDomain}/api/reset-password/${token}`,
            method: 'post'
        }
    },
    createCoupon: { url: `${backendDomain}/api/create-coupon`, method: 'post' },
    allCoupons: { url: `${backendDomain}/api/all-coupons`, method: 'get' },
    updateCoupon: { url: (id) => `${backendDomain}/api/update-coupon/${id}`, method: 'put' },
    deleteCoupon: { url: (id) => `${backendDomain}/api/delete-coupon/${id}`, method: 'delete' },
    toggleCoupon: { url: (id) => `${backendDomain}/api/toggle-coupon-status/${id}`, method: 'patch' },
}

export default SummaryApi;

