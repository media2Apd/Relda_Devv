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
    viewuser:{
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
    cookies:{
        url : `${backendDomain}/api/accept-cookies`,
        method : 'POST'
    },
    updateOrderStatus:{
        url : `${backendDomain}/api/update-order-status`,
        method : 'POST'
    },
    searchOrder: (orderId) => ({
        url: `${backendDomain}/api/search/${orderId}`,
        method: 'get'
    }),
    complaintSupport: {
        url : `${backendDomain}/api/complaint`,
        method : 'POST'
    },
    CancelOrder : {
        url: `${backendDomain}/api/cancel-order`,
        method : 'PUT'
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
	UploadBlog: {
        url: `${backendDomain}/api/add-blog`,
        method: 'post'
     },
        getBlogs: {
            url: `${backendDomain}/api/get-blogs`,
            method: 'get'
        },  
        getOneBlog: (id)=>{
            return {
                url: `${backendDomain}/api/get-blog/${id}`,
                method: 'get'
            }
        },
        updateBlog:(id)=>{ 
            return{
                url: `${backendDomain}/api/update-blog/${id}`,
                method: 'PUT'
        }
        },
        deleteBlog:(id) => {
            return{
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
        getOneOfferPoster: (id)=>{
            return {
                url: `${backendDomain}/api/get-offerposter/${id}`,
                method: 'get'
            }
        },
        updateOfferPoster:(id)=>{ 
            return{
                url: `${backendDomain}/api/update-offerposter/${id}`,
                method: 'PUT'
        }
        },
        deleteOfferPoster:(id) => {
            return{
                url: `${backendDomain}/api/delete-offerposter/${id}`,
                method: 'delete'
            }
        },
        relatedProducts:(viewed) => {
            return{
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
}

export default SummaryApi;
// =========================================================================
// 1️⃣ PAYMENT LINK ORDER CONFIRMATION EMAIL (TO CUSTOMER)
// =========================================================================
const sendOrderConfirmationEmailLink = async (customerInfo, razorpayPaymentId, order) => {
  try {
    const payment = await verifyPaymentStatus(razorpayPaymentId);

    if (!payment || !payment.isPaymentCaptured) {
      throw new Error('Payment not captured');
    }

    const amountPaid = payment.amount / 100;
    const paymentStatus = payment.status;
    const transactionId = payment.id;
    const paymentType = payment.method ? payment.method.toUpperCase() : 'ONLINE';
    const vpa = payment.upi?.vpa || '';
    const cardType = (paymentType === 'CARD' && payment.card) ? payment.card.type : '';

    const product = order.productDetails?.[0];
    if (!product) {
      throw new Error('Product details not found in the order');
    }

    const extraPaymentRow = vpa
      ? `<tr><td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">UPI ID</td><td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">${vpa}</td></tr>`
      : cardType
      ? `<tr><td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Card Type</td><td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">${cardType.toUpperCase()} Card</td></tr>`
      : '';

    const serialRow = order.serialNumber ? `
      <tr>
        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Serial Number</td>
        <td style="padding: 10px 16px; color: #111; font-weight: bold; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
          ${order.serialNumber}
        </td>
      </tr>
    ` : '';

    const mailOptions = {
      from: 'admin@reldaindia.com',
      to: order.billing_email,
      subject: `Payment Received - Order #${order.orderId} | RELDA India Pvt Ltd`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
            <tr>
              <td align="center">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                  
                  <!-- Top Logo Bar (White Background - 100% Vivid Logo) -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Red Hero Banner -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">Payment Successful!</h1>
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Your order has been placed successfully</p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${order.billing_name},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        Thank you for your payment! We have successfully received payment for your order. Here is your transaction summary:
                      </p>

                      <!-- Order ID Banner -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff5f5; border-left: 4px solid #E60000; border-radius: 6px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 12px 16px;">
                            <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Order Reference ID</span>
                            <div style="font-size: 18px; font-weight: 800; color: #E60000; margin-top: 2px;">#${order.orderId}</div>
                          </td>
                        </tr>
                      </table>

                      <!-- Order & Payment Details Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eef0f2;">
                            Order & Payment Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Product</td>
                          <td style="padding: 12px 16px; color: #111; font-weight: 700; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.productName}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Quantity</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: bold; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.quantity} unit(s)
                          </td>
                        </tr>
                        ${serialRow}
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Transaction ID</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
                            ${transactionId}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Payment Method</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${paymentType}
                          </td>
                        </tr>
                        ${extraPaymentRow}
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Payment Status</td>
                          <td style="padding: 10px 16px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                              ${paymentStatus.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                        <tr style="background-color: #fff9f9;">
                          <td style="padding: 14px 16px; color: #111; font-size: 15px; font-weight: 700;">Total Paid</td>
                          <td style="padding: 14px 16px; color: #E60000; font-weight: 800; font-size: 20px; text-align: right;">
                            ₹${Number(amountPaid).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </table>

                      <!-- Shipping Address Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase; letter-spacing: 0.5px;">Shipping / Delivery Address</span>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #333; line-height: 1.5;">
                              ${order.shipping_address}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Support Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Have questions regarding your order or warranty?
                            </p>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #666;">
                              Email us: <a href="mailto:support@reldaindia.com" style="color: #E60000; text-decoration: none; font-weight: bold;">support@reldaindia.com</a> &nbsp;|&nbsp; Call: <a href="tel:9884890934" style="color: #E60000; text-decoration: none; font-weight: bold;">9884890934</a>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0 0; font-size: 14px; color: #333; line-height: 1.5;">
                        Warm Regards,<br>
                        <strong style="color: #E60000; font-size: 15px;">RELDA India Pvt Ltd</strong>
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 20px; text-align: center;">
                      <p style="margin: 0 0 6px; font-size: 12px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #666;">
                        <a href="https://www.reldaindia.com" style="color: #ffffff; text-decoration: none; font-weight: 600;">www.reldaindia.com</a>
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    console.log(`📧 Sending Confirmation Link email to: ${order.billing_email}`);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending order confirmation email link:', error.message);
  }
};


// =========================================================================
// 2️⃣ REGULAR ONLINE CHECKOUT ORDER CONFIRMATION EMAIL (TO CUSTOMER)
// =========================================================================
const sendOrderConfirmationEmail = async (customerInfo, razorpayPaymentId, order) => {
  try {
    const { isPaymentCaptured, paymentMethod, paymentDetails } = await verifyPayment(razorpayPaymentId);

    if (!isPaymentCaptured) {
      throw new Error('Payment not captured');
    }

    const amountPaid = paymentDetails.amount / 100;
    const paymentStatus = paymentDetails.status;
    const transactionId = paymentDetails.id;
    const paymentType = paymentMethod ? paymentMethod.toUpperCase() : 'ONLINE';
    const vpa = paymentDetails.upi?.vpa || '';
    const cardType = (paymentType === 'CARD' && paymentDetails.card) ? paymentDetails.card.type : '';

    const product = order.productDetails && order.productDetails[0];
    if (!product) {
      throw new Error('Product details not found in the order');
    }

    const extraPaymentRow = vpa
      ? `<tr><td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">UPI ID</td><td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">${vpa}</td></tr>`
      : cardType
      ? `<tr><td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Card Type</td><td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">${cardType.toUpperCase()} Card</td></tr>`
      : '';

    const serialRow = order.serialNumber ? `
      <tr>
        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Serial Number</td>
        <td style="padding: 10px 16px; color: #111; font-weight: bold; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
          ${order.serialNumber}
        </td>
      </tr>
    ` : '';

    const mailOptions = {
      from: 'admin@reldaindia.com',
      to: order.billing_email,
      subject: `Order Confirmation - #${order.orderId} | RELDA India Pvt Ltd`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
            <tr>
              <td align="center">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                  
                  <!-- Top Logo Bar (White Background - 100% Vivid Logo) -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Red Hero Banner -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">Order Placed!</h1>
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Thank you for shopping with RELDA</p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${order.billing_name},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        Your payment has been successfully processed! We're preparing your order for shipment. Here are the order details:
                      </p>

                      <!-- Order ID Banner -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff5f5; border-left: 4px solid #E60000; border-radius: 6px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 12px 16px;">
                            <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Order Reference ID</span>
                            <div style="font-size: 18px; font-weight: 800; color: #E60000; margin-top: 2px;">#${order.orderId}</div>
                          </td>
                        </tr>
                      </table>

                      <!-- Order Summary Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eef0f2;">
                            Order Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Product Name</td>
                          <td style="padding: 12px 16px; color: #111; font-weight: 700; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.productName}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Quantity</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: bold; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.quantity} unit(s)
                          </td>
                        </tr>
                        ${serialRow}
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Transaction ID</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
                            ${transactionId}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Payment Method</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${paymentType}
                          </td>
                        </tr>
                        ${extraPaymentRow}
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Payment Status</td>
                          <td style="padding: 10px 16px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                              ${paymentStatus.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                        <tr style="background-color: #fff9f9;">
                          <td style="padding: 14px 16px; color: #111; font-size: 15px; font-weight: 700;">Total Amount Paid</td>
                          <td style="padding: 14px 16px; color: #E60000; font-weight: 800; font-size: 20px; text-align: right;">
                            ₹${Number(amountPaid).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </table>

                      <!-- Shipping Address Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase; letter-spacing: 0.5px;">Shipping / Delivery Address</span>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #333; line-height: 1.5;">
                              ${order.shipping_address}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Support Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Have questions regarding your order or warranty?
                            </p>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #666;">
                              Email us: <a href="mailto:support@reldaindia.com" style="color: #E60000; text-decoration: none; font-weight: bold;">support@reldaindia.com</a> &nbsp;|&nbsp; Call: <a href="tel:9884890934" style="color: #E60000; text-decoration: none; font-weight: bold;">9884890934</a>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0 0; font-size: 14px; color: #333; line-height: 1.5;">
                        Warm Regards,<br>
                        <strong style="color: #E60000; font-size: 15px;">RELDA India Pvt Ltd</strong>
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 20px; text-align: center;">
                      <p style="margin: 0 0 6px; font-size: 12px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #666;">
                        <a href="https://www.reldaindia.com" style="color: #ffffff; text-decoration: none; font-weight: 600;">www.reldaindia.com</a>
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    console.log(`📧 Sending Online Order confirmation email to: ${order.billing_email}`);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending online order confirmation email:', error.message);
  }
};


// =========================================================================
// 3️⃣ ADMIN NEW ORDER ALERT NOTIFICATION EMAIL
// =========================================================================
const sendAdminNotificationEmail = async (order) => {
  try {
    const productRows = (order.productDetails || []).map((p, idx) => `
      <tr>
        <td style="padding: 10px 14px; font-size: 13px; color: #333; border-bottom: 1px solid #f0f0f0;">
          ${idx + 1}. <strong>${p.productName}</strong>
          ${p.serialNumber ? `<br><span style="font-size: 11px; color: #888; font-family: monospace;">Serial: ${p.serialNumber}</span>` : ''}
        </td>
        <td style="padding: 10px 14px; font-size: 13px; color: #333; text-align: center; border-bottom: 1px solid #f0f0f0;">
          ${p.quantity}
        </td>
        <td style="padding: 10px 14px; font-size: 13px; color: #111; font-weight: 600; text-align: right; border-bottom: 1px solid #f0f0f0;">
          ₹${Number(p.sellingPrice * p.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');

    const mailOptions = {
      from: 'support@reldaindia.com',
      to: 'admin@reldaindia.com',
      subject: `🚨 New Order Alert: #${order.orderId} - ₹${Number(order.totalAmount).toLocaleString('en-IN')}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
            <tr>
              <td align="center">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                  
                  <!-- Top Logo Bar -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 22px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 160px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Admin Alert Header -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 25px; text-align: left; border-left: 6px solid #E60000;">
                      <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">
                        ⚡ New Order Received - <span style="color: #ff4d4d;">#${order.orderId}</span>
                      </h2>
                      <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">
                        Processed: ${moment().format('DD MMM YYYY, hh:mm A')}
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 25px;">
                      
                      <!-- Customer Information Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 10px; margin-bottom: 20px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Customer Details
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Name:</td>
                          <td style="padding: 8px 14px; color: #111; font-weight: 700; font-size: 13px; text-align: right;">${order.billing_name}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Email:</td>
                          <td style="padding: 8px 14px; color: #111; font-weight: 600; font-size: 13px; text-align: right;">
                            <a href="mailto:${order.billing_email}" style="color: #E60000; text-decoration: none;">${order.billing_email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Phone:</td>
                          <td style="padding: 8px 14px; color: #111; font-weight: 600; font-size: 13px; text-align: right;">
                            <a href="tel:${order.billing_tel}" style="color: #111; text-decoration: none;">${order.billing_tel}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Payment Status:</td>
                          <td style="padding: 8px 14px; text-align: right;">
                            <span style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                              ${(order.paymentDetails?.payment_status || 'PAID').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Payment Mode:</td>
                          <td style="padding: 8px 14px; color: #111; font-weight: 600; font-size: 13px; text-align: right;">
                            ${order.paymentDetails?.payment_method_type || 'N/A'}
                          </td>
                        </tr>
                      </table>

                      <!-- Ordered Items Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                        <tr style="background-color: #fafbfc;">
                          <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: left; border-bottom: 1px solid #eef0f2;">Item</th>
                          <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: center; border-bottom: 1px solid #eef0f2;">Qty</th>
                          <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: right; border-bottom: 1px solid #eef0f2;">Amount</th>
                        </tr>
                        ${productRows}
                        <tr style="background-color: #fff9f9;">
                          <td colspan="2" style="padding: 12px 14px; font-size: 14px; font-weight: 700; color: #111;">Total Order Value:</td>
                          <td style="padding: 12px 14px; font-size: 18px; font-weight: 800; color: #E60000; text-align: right;">
                            ₹${Number(order.totalAmount).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </table>

                      <!-- Shipping Address Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 10px; margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 12px 14px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase;">Shipping Address:</span>
                            <p style="margin: 4px 0 0; font-size: 13px; color: #333; line-height: 1.5;">${order.shipping_address}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 15px 0 0; font-size: 12px; color: #888; text-align: center;">
                        This is an automated system notification from RELDA India Pvt Ltd Order Engine.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. Admin Portal.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Admin notification email sent for order: #${order.orderId}`);
  } catch (error) {
    console.error('Error sending admin notification email:', error.message);
  }
};


// =========================================================================
// 4️⃣ UNPAID CART REMINDER CRON (EVERY 10 MINS)
// =========================================================================
cron.schedule('*/10 * * * *', async () => {
  try {
    const unpaidOrders = await orderModel.find({
      "paymentDetails.payment_status": "pending",
      reminderSent: false,
      createdAt: { $lte: new Date(Date.now() - 10 * 60 * 1000) },
    });

    for (const order of unpaidOrders) {
      const itemsListHtml = (order.productDetails || []).map(item => `
        <tr>
          <td style="padding: 10px 14px; font-size: 13px; color: #333; border-bottom: 1px solid #f0f0f0;">
            <strong>${item.productName}</strong>
          </td>
          <td style="padding: 10px 14px; font-size: 13px; color: #333; text-align: center; border-bottom: 1px solid #f0f0f0;">
            ${item.quantity}
          </td>
          <td style="padding: 10px 14px; font-size: 13px; color: #111; font-weight: 600; text-align: right; border-bottom: 1px solid #f0f0f0;">
            ₹${Number(item.sellingPrice * item.quantity).toLocaleString('en-IN')}
          </td>
        </tr>
      `).join('');

      const mailOptions = {
        from: 'admin@reldaindia.com',
        to: order.billing_email,
        subject: `Complete Your Order #${order.orderId} | RELDA India Pvt Ltd`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
              <tr>
                <td align="center">
                  
                  <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                    
                    <!-- Top Logo Bar -->
                    <tr>
                      <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                        <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                      </td>
                    </tr>

                    <!-- Red Hero Banner -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">Don't Miss Out!</h1>
                        <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Your favorite items are waiting in your cart</p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 30px 25px;">
                        
                        <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                          Hello ${order.billing_name},
                        </p>
                        <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                          We noticed you added items to your cart but haven't finished checking out yet. Complete your order now before stock runs out:
                        </p>

                        <!-- Items Table -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                          <tr style="background-color: #fafbfc;">
                            <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: left; border-bottom: 1px solid #eef0f2;">Product</th>
                            <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: center; border-bottom: 1px solid #eef0f2;">Qty</th>
                            <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: right; border-bottom: 1px solid #eef0f2;">Price</th>
                          </tr>
                          ${itemsListHtml}
                          <tr style="background-color: #fff9f9;">
                            <td colspan="2" style="padding: 14px 16px; color: #111; font-size: 15px; font-weight: 700;">Total Amount:</td>
                            <td style="padding: 14px 16px; color: #E60000; font-weight: 800; font-size: 20px; text-align: right;">
                              ₹${Number(order.totalAmount).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </table>

                        <!-- CTA Button -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 26px;">
                          <tr>
                            <td align="center">
                              <a href="https://www.reldaindia.com/checkout" style="background-color: #E60000; color: #ffffff; text-decoration: none; padding: 15px 36px; border-radius: 30px; font-size: 15px; font-weight: 800; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(230,0,0,0.3);">
                                COMPLETE YOUR PURCHASE →
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Support Info -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                          <tr>
                            <td style="padding: 16px 18px;">
                              <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                                Need help completing your order?
                              </p>
                              <p style="margin: 6px 0 0; font-size: 13px; color: #666;">
                                Contact our team: <a href="mailto:support@reldaindia.com" style="color: #E60000; text-decoration: none; font-weight: bold;">support@reldaindia.com</a> &nbsp;|&nbsp; Call: <a href="tel:9884890934" style="color: #E60000; text-decoration: none; font-weight: bold;">9884890934</a>
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 20px 0 0; font-size: 14px; color: #333; line-height: 1.5;">
                          Warm Regards,<br>
                          <strong style="color: #E60000; font-size: 15px;">RELDA India Pvt Ltd</strong>
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #1a1a1a; padding: 22px 20px; text-align: center;">
                        <p style="margin: 0 0 6px; font-size: 12px; color: #888;">
                          © ${new Date().getFullYear()} RELDA India Pvt Ltd. All rights reserved.
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #666;">
                          <a href="https://www.reldaindia.com" style="color: #ffffff; text-decoration: none; font-weight: 600;">www.reldaindia.com</a>
                        </p>
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      order.reminderSent = true;
      await order.save();
      console.log(`📧 Cart reminder email sent to: ${order.billing_email}`);
    }
  } catch (error) {
    console.error("Error sending reminder emails:", error.message);
  }
});

const axios = require("axios");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

const {
  createZohoSalesOrder,
  confirmZohoSalesOrder,
  getZohoSalesOrder
} = require("../services/zohoSalesOrder.service");

const {
  createZohoCustomer,
  searchZohoCustomer,
  updateZohoCustomer,
  getZohoCustomerById
} = require("../services/zohoCustomer.service");

const {
  getLocationIdByName
} = require("../services/zohoLocationService");

const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders");
const { refreshZohoAccessToken } = require("../services/zohoTokenRefresh.service");

const ZOHO_BASE = "https://www.zohoapis.in/inventory/v1";

/* ================= ZOHO REQUEST WITH AUTO-REFRESH ================= */
async function zohoRequest(config) {
  try {
    return await axios(config);
  } catch (err) {
    if (err.response?.status === 401) {
      console.log("🔄 Access token expired, refreshing token...");
      const newToken = await refreshZohoAccessToken();
      setAccessToken(newToken);
      config.headers = getZohoHeaders();
      return await axios(config);
    }
    throw err;
  }
}

/* ================= HELPER FUNCTIONS ================= */
function parseAddress(addressString = "") {
  const parts = addressString.split(",").map((p) => p.trim());
  return {
    address: parts.slice(0, 2).join(", "),
    city: parts[2] || "",
    state: parts[3] || "",
    zip: parts[4] || "",
    country: parts[5] || "India"
  };
}

function normalizeCustomerName(name, email) {
  if (name && name.trim().length >= 3) {
    return name
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  if (email) {
    return (
      email
        .split("@")[0]
        .replace(/[^a-zA-Z]/g, "")
        .replace(/\b\w/g, (c) => c.toUpperCase()) + " Customer"
    );
  }

  return "Relda Customer";
}

// 👉 Extract Serial Numbers
function getSerialNumbers(p, order, idx = 0) {
  const candidates = [
    p?.serialNumber,
    p?.productSerialNumber,
    p?.serial_number,
    p?.serialNo,
    p?.serial,
    order?.serialNumber,
    order?.productSerialNumber,
    order?.serial_number,
    order?.serialNo,
    order?.serial,
    order?.productDetails?.[idx]?.serialNumber,
    order?.productDetails?.[idx]?.productSerialNumber,
    order?.productDetails?.[idx]?.serial_number,
    order?.productDetails?.[idx]?.serialNo
  ];

  for (const val of candidates) {
    if (val && typeof val === "string" && val.trim().length > 0) {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (Array.isArray(val) && val.length > 0) {
      return val.map((s) => String(s).trim()).filter(Boolean);
    }
  }

  if (Array.isArray(p?.serialNumbers) && p.serialNumbers.length > 0) {
    return p.serialNumbers.map((s) => String(s).trim()).filter(Boolean);
  }
  if (Array.isArray(order?.serialNumbers) && order.serialNumbers.length > 0) {
    if (order.productDetails?.length === 1) {
      return order.serialNumbers.map((s) => String(s).trim()).filter(Boolean);
    }
    if (order.serialNumbers[idx]) {
      return [String(order.serialNumbers[idx]).trim()];
    }
  }

  return [];
}

// 🔥 SMART BASE RATE CALCULATOR (Exact Rupee Match)
function calculateExactBaseRate(unitPrice, gstPercent = 18, quantity = 1) {
  const targetTotal = Number(unitPrice) * quantity;
  const halfGst = (gstPercent / 2) / 100;

  let bestRate = Number((unitPrice / (1 + gstPercent / 100)).toFixed(2));

  function computeTotal(r) {
    const lineSubTotal = Number((r * quantity).toFixed(2));
    const cgst = Number((lineSubTotal * halfGst).toFixed(2));
    const sgst = Number((lineSubTotal * halfGst).toFixed(2));
    return Number((lineSubTotal + cgst + sgst).toFixed(2));
  }

  let bestDiff = Math.abs(computeTotal(bestRate) - targetTotal);

  for (const delta of [0.01, -0.01, 0.02, -0.02]) {
    const testRate = Number((bestRate + delta).toFixed(2));
    const testDiff = Math.abs(computeTotal(testRate) - targetTotal);
    if (testDiff < bestDiff) {
      bestRate = testRate;
      bestDiff = testDiff;
    }
  }

  return bestRate;
}

/* ================= ZOHO FULFILLMENT INTERNAL API CALLS ================= */

// 1. Create Package
async function createZohoPackage({ salesorder_id, line_items }) {
  const payload = {
    date: new Date().toISOString().split("T")[0],
    line_items: line_items.map((item) => ({
      so_line_item_id: item.so_line_item_id,
      quantity: item.quantity
    }))
  };

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/packages?salesorder_id=${salesorder_id}`,
    data: payload,
    headers: getZohoHeaders()
  });

  return res.data.package;
}

// 2. Create Shipment and Mark as Delivered
async function createZohoShipmentDelivered({ salesorder_id, package_id }) {
  const payload = {
    date: new Date().toISOString().split("T")[0],
    delivery_method: "Hand Delivery",
    tracking_number: "SALE-IN-HAND"
  };

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/shipmentorders?package_ids=${package_id}&salesorder_id=${salesorder_id}&is_delivered=true`,
    data: payload,
    headers: getZohoHeaders()
  });

  return res.data.shipmentorder;
}

// 3. Create Invoice against the Sales Order
async function createZohoInvoice({ salesorder_id, customer_id, line_items, adjustment, warehouse_location_id }) {
  const payload = {
    customer_id,
    salesorder_id,
    date: new Date().toISOString().split("T")[0],
    line_items: line_items.map((item) => ({
      salesorder_item_id: item.so_line_item_id,
      item_id: item.item_id,
      quantity: item.quantity,
      rate: item.rate,
      description: item.description, // 👈 Serial number invoice-la print aagum
      ...(warehouse_location_id ? { location_id: warehouse_location_id } : {})
    })),
    ...(adjustment && Math.abs(adjustment) > 0 ? {
      adjustment,
      adjustment_description: "Round Off"
    } : {})
  };

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/invoices`,
    data: payload,
    headers: getZohoHeaders()
  });

  return res.data.invoice;
}

// 4. Record Payment on Invoice
async function recordZohoPayment({ customer_id, invoice_id, amount, reference_number, payment_mode }) {
  const payload = {
    customer_id,
    payment_mode: payment_mode || "cash",
    amount,
    date: new Date().toISOString().split("T")[0],
    reference_number: reference_number || "HAND-PAYMENT",
    invoices: [
      {
        invoice_id,
        amount_applied: amount
      }
    ]
  };

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/customerpayments`,
    data: payload,
    headers: getZohoHeaders()
  });

  return res.data.payment;
}

/* ================= MAIN EXPORTED FUNCTION ================= */
module.exports = async function createSalesOrderAndReleaseStock(
  order,
  customerUser,
  reqUser
) {
  try {
    let zohoCustomerId = null;

    const isManageSales =
      customerUser?.role === "MANAGESALES" || reqUser?.role === "MANAGESALES";

    const effectiveUser = isManageSales
      ? (customerUser?.role === "MANAGESALES" ? customerUser : reqUser)
      : (reqUser || customerUser);

    console.log(`👤 Order Processed By: ${effectiveUser?.name || "System"} | Is ManageSales: ${isManageSales}`);

    console.log("🔍 DEBUG SERIAL DATA IN ORDER:", {
      order_serialNumber: order?.serialNumber,
      order_productSerialNumber: order?.productSerialNumber,
      order_serialNo: order?.serialNo,
      prod_serialNumber: order?.productDetails?.[0]?.serialNumber,
      prod_productSerialNumber: order?.productDetails?.[0]?.productSerialNumber
    });

    // =========================================================================
    // 1️⃣ CUSTOMER RESOLUTION
    // =========================================================================
    const customerName = normalizeCustomerName(
      order.billing_name,
      order.billing_email
    );

    const customerData = {
      name: customerName,
      email: order.billing_email?.trim()?.toLowerCase(),
      mobile: order.billing_tel?.trim(),
      address: parseAddress(order.billing_address),
      isBusiness: !!order.gstDetails?.gstin,
      gstin: order.gstDetails?.gstin?.trim(),
      companyName: order.gstDetails?.companyName || customerName,
      gst_treatment: order.gstDetails?.gstin ? "business_gst" : "consumer"
    };

    if (isManageSales) {
      console.log(`💼 MANAGESALES: Creating/Searching Zoho Contact for: ${customerData.email}`);

      const existingCustomer = await searchZohoCustomer({
        email: customerData.email,
        gstin: customerData.gstin,
        name: customerData.name
      });

      if (existingCustomer) {
        zohoCustomerId = existingCustomer.contact_id;
        console.log(`✅ MANAGESALES: Existing customer linked: ${zohoCustomerId}`);
        await updateZohoCustomer(zohoCustomerId, customerData);
      } else {
        console.log(`🆕 MANAGESALES: New customer created: ${customerName}`);
        const created = await createZohoCustomer(customerData);
        zohoCustomerId = created.contact_id;
      }

      order.zohoCustomerId = zohoCustomerId;

    } else {
      if (customerUser?.zohoCustomerId) {
        const validContact = await getZohoCustomerById(customerUser.zohoCustomerId);
        if (validContact) {
          zohoCustomerId = validContact.contact_id;
        } else {
          customerUser.zohoCustomerId = null;
          await userModel.updateOne(
            { _id: customerUser._id },
            { $unset: { zohoCustomerId: 1 } }
          ).catch(() => {});
        }
      }

      if (!zohoCustomerId) {
        const existingCustomer = await searchZohoCustomer({
          email: customerData.email,
          gstin: customerData.gstin,
          name: customerData.name
        });

        if (existingCustomer) {
          zohoCustomerId = existingCustomer.contact_id;
          await updateZohoCustomer(zohoCustomerId, customerData);
        } else {
          const created = await createZohoCustomer(customerData);
          zohoCustomerId = created.contact_id;
        }

        if (customerUser?._id && zohoCustomerId) {
          await userModel.updateOne(
            { _id: customerUser._id },
            { $set: { zohoCustomerId } }
          ).catch(() => {});
        }
      }
    }

    if (!zohoCustomerId) {
      throw new Error("Zoho customer ID could not be resolved from billing details");
    }

    // =========================================================================
    // 🏢 2️⃣ LOCATION RESOLUTION
    // =========================================================================
    const headOfficeLocationId = await getLocationIdByName("Head Office") || await getLocationIdByName("RELDA");

    let brandshopLocationId = null;
    if (isManageSales && effectiveUser?.zohoLocationId) {
      brandshopLocationId = effectiveUser.zohoLocationId;
      console.log(`🏬 Brandshop Stock Location Assigned: ${brandshopLocationId}`);
    }

    // =========================================================================
    // 3️⃣ PREPARE SALES ORDER LINE ITEMS
    // =========================================================================
    const allCollectedSerials = [];

    const line_items = await Promise.all(
      order.productDetails.map(async (p, idx) => {
        const prod = await productModel.findById(p.productId);
        if (!prod?.zohoVariantId) {
          throw new Error(`Zoho item missing for product ${p.productId}`);
        }

        const serial_numbers = getSerialNumbers(p, order, idx);
        allCollectedSerials.push(...serial_numbers);

        const inclusivePrice = Number(p.sellingPrice || prod.sellingPrice || 0);
        const gstRate = Number(prod.gstPercent || p.gstPercent || 18);
        const quantity = Number(p.quantity || 1);

        const exactBaseRate = calculateExactBaseRate(inclusivePrice, gstRate, quantity);

        console.log(`💰 Item: ${prod.productName} | Website Paid: ₹${inclusivePrice} | Exact Rate: ₹${exactBaseRate} | Serials: ${JSON.stringify(serial_numbers)}`);

        return {
          item_id: prod.zohoVariantId,
          quantity: p.quantity,
          rate: exactBaseRate,
          ...(brandshopLocationId ? { location_id: brandshopLocationId } : {}),
          // 👉 Description-la serial number print aagum (Error varaadhu!)
          description: serial_numbers.length > 0 ? `Serial No: ${serial_numbers.join(", ")}` : (prod.productName || "Product")
        };
      })
    );

    const uniqueSerials = [...new Set(allCollectedSerials)];
    const serialNotes = uniqueSerials.length > 0 ? ` | Serial: ${uniqueSerials.join(", ")}` : "";

    // =========================================================================
    // 4️⃣ TOTAL & ROUND-OFF VERIFICATION
    // =========================================================================
    const expectedTotal = Number(
      order.totalAmount ||
      order.productDetails.reduce((sum, p) => sum + (Number(p.sellingPrice || 0) * Number(p.quantity || 1)), 0)
    );

    const calculatedSubTotal = line_items.reduce((sum, item) => sum + (Number(item.rate) * Number(item.quantity)), 0);
    const calculatedTaxTotal = line_items.reduce((sum, item) => {
      const lineAmt = Number(item.rate) * Number(item.quantity);
      const cgst = Number((lineAmt * 0.09).toFixed(2));
      const sgst = Number((lineAmt * 0.09).toFixed(2));
      return sum + cgst + sgst;
    }, 0);

    const zohoEstimatedTotal = Number((calculatedSubTotal + calculatedTaxTotal).toFixed(2));
    const roundOffDiff = Number((expectedTotal - zohoEstimatedTotal).toFixed(2));

    const payload = {
      customer_id: zohoCustomerId,
      date: new Date().toISOString().split("T")[0],
      reference_number: order.orderId,
      notes: `${order.saleInHand ? "Hand Sale" : "Order created from Website"}${serialNotes}`,
      line_items,
      ...(headOfficeLocationId ? { location_id: headOfficeLocationId } : {}),
      ...(Math.abs(roundOffDiff) > 0 && Math.abs(roundOffDiff) <= 5 ? {
        adjustment: roundOffDiff,
        adjustment_description: "Round Off"
      } : {})
    };

    if (isManageSales) {
      payload.salesperson_name = effectiveUser?.name || "MANAGESALES";
    }

    console.log("📦 FINAL ZOHO SO PAYLOAD:", JSON.stringify(payload, null, 2));

    // 5️⃣ CREATE & CONFIRM SALES ORDER
    const so = await createZohoSalesOrder(payload);
    await confirmZohoSalesOrder(so.salesorder_id);
    console.log("✅ Zoho Sales Order Created & Confirmed in Location:", brandshopLocationId || headOfficeLocationId);

    order.zohoSalesOrderId = so.salesorder_id;

    // =========================================================================
    // 6️⃣ SALE IN HAND / FULFILLMENT FLOW
    // =========================================================================
    if (order.saleInHand === true) {
      console.log("⚡ Sale in Hand detected for order:", order.orderId);

      const fullSO = await getZohoSalesOrder(so.salesorder_id);

      // Zoho SO response line items resolve panrom
      const soLines = fullSO?.salesorder?.line_items || fullSO?.line_items || [];

      const fulfillmentItems = soLines.map((li, idx) => {
        const itemDetail = order.productDetails?.[idx];
        const serial_numbers = getSerialNumbers(itemDetail, order, idx);
        const soLineId = li.line_item_id || li.so_line_item_id || li.salesorder_item_id;

        return {
          so_line_item_id: soLineId,
          item_id: li.item_id,
          quantity: li.quantity,
          rate: li.rate,
          description: serial_numbers.length > 0 ? `Serial No: ${serial_numbers.join(", ")}` : (li.description || "Product")
        };
      });

      // A) Create Package (Clean payload - Error varaadhu!)
      const pkg = await createZohoPackage({
        salesorder_id: so.salesorder_id,
        line_items: fulfillmentItems
      });
      order.zohoPackageId = pkg.package_id;
      console.log("📦 Package Created from Brandshop:", pkg.package_id);

      // B) Create Shipment and Mark as Delivered
      const shipment = await createZohoShipmentDelivered({
        salesorder_id: so.salesorder_id,
        package_id: pkg.package_id
      });
      order.zohoShipmentOrderId = shipment.shipmentorder_id;
      console.log("🚚 Shipment Marked as Delivered from Brandshop:", brandshopLocationId || "Default");

      // C) Create Invoice against Sales Order
      const invoice = await createZohoInvoice({
        salesorder_id: so.salesorder_id,
        customer_id: zohoCustomerId,
        line_items: fulfillmentItems,
        adjustment: Math.abs(roundOffDiff) > 0 && Math.abs(roundOffDiff) <= 5 ? roundOffDiff : 0,
        warehouse_location_id: brandshopLocationId
      });
      order.zohoInvoiceId = invoice.invoice_id;
      console.log("🧾 Invoice Generated with Serials in Description:", invoice.invoice_id);

      // D) Record Payment on Invoice
      const isCash =
        order.paymentDetails?.payment_method_type === "CASH" ||
        order.paymentDetails?.payment_status === "cash_on_hand";
      const paymentModeForZoho = isCash ? "cash" : "online";

      const payment = await recordZohoPayment({
        customer_id: zohoCustomerId,
        invoice_id: invoice.invoice_id,
        amount: invoice.total || expectedTotal,
        reference_number: order.orderId,
        payment_mode: paymentModeForZoho
      });
      order.zohoPaymentId = payment.payment_id;
      console.log("💰 Payment Recorded on Invoice:", payment.payment_id);

      // E) Update Order Status
      order.order_status = "delivered";
      order.paymentDetails.payment_status = "paid";
      order.statusUpdates.push({
        status: "delivered",
        updatedAt: new Date()
      });

      console.log(`🎯 Zoho Sales Order CLOSED! Final Total: ₹${invoice.total}`);
    } else {
      order.order_status = "ordered";
      order.paymentDetails.payment_status = "success";
    }

    await order.save();
    return so;

  } catch (err) {
    console.error(
      "❌ createSalesOrderAndReleaseStock FAILED:",
      err.response?.data || err.message
    );
    throw err;
  }
};

const axios = require("axios");
const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders");
const { refreshZohoAccessToken } = require("./zohoTokenRefresh.service");

const ZOHO_BASE = "https://www.zohoapis.in/inventory/v1";

async function zohoRequest(config) {
  try {
    return await axios(config);
  } catch (err) {
    if (err.response?.status === 401) {
      const newToken = await refreshZohoAccessToken();
      setAccessToken(newToken);
      config.headers = getZohoHeaders();
      return await axios(config);
    }
    throw err;
  }
}

/**
 * Validates whether a contact ID actually exists and is accessible in current Zoho Org
 */
exports.getZohoCustomerById = async (contactId) => {
  if (!contactId) return null;
  try {
    const res = await zohoRequest({
      method: "GET",
      url: `${ZOHO_BASE}/contacts/${contactId}`,
      headers: getZohoHeaders()
    });
    return res.data?.contact || null;
  } catch (err) {
    // 404 or Zoho 1002: Contact deleted, inaccessible or from different org
    if (err.response?.status === 404 || err.response?.data?.code === 1002) {
      console.warn(`⚠️ Zoho contact ID ${contactId} is invalid/inaccessible in this org.`);
      return null;
    }
    throw err;
  }
};

/**
 * Comprehensive search across GST, Email, and Name
 */
exports.searchZohoCustomer = async ({ email, gstin, name }) => {
  try {
    // 1. By GSTIN
    if (gstin) {
      const res = await zohoRequest({
        method: "GET",
        url: `${ZOHO_BASE}/contacts`,
        params: { gst_no: gstin },
        headers: getZohoHeaders()
      });
      if (res.data?.contacts?.length > 0) {
        return res.data.contacts[0];
      }
    }

    // 2. By Email
    if (email) {
      const res = await zohoRequest({
        method: "GET",
        url: `${ZOHO_BASE}/contacts`,
        params: { email: email.trim() },
        headers: getZohoHeaders()
      });
      if (res.data?.contacts?.length > 0) {
        return res.data.contacts[0];
      }
    }

    // 3. By Contact Name (Resolves code 3062)
    if (name) {
      const res = await zohoRequest({
        method: "GET",
        url: `${ZOHO_BASE}/contacts`,
        params: { search_text: name.trim() },
        headers: getZohoHeaders()
      });

      const contacts = res.data?.contacts || [];
      const exactMatch = contacts.find(
        (c) => c.contact_name?.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (exactMatch) return exactMatch;
      if (contacts.length > 0) return contacts[0];
    }

    return null;
  } catch (err) {
    console.error("Zoho search failed:", err.response?.data || err.message);
    return null;
  }
};

/**
 * Creates customer with automatic fallback if name collision occurs
 */
exports.createZohoCustomer = async ({
  name,
  email,
  mobile,
  address = {},
  isBusiness = false,
  gstin,
  companyName
}) => {
  const buildPayload = (contactName) => {
    const payload = {
      contact_name: contactName,
      contact_type: "customer",
      phone: mobile || "",
      email: email || "",
      gst_treatment: isBusiness && gstin ? "business_gst" : "consumer",
      billing_address: {
        address: address.address || address.street || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || address.pinCode || "",
        country: "India"
      },
      shipping_address: {
        address: address.address || address.street || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || address.pinCode || "",
        country: "India"
      }
    };

    if (isBusiness && gstin) {
      payload.gst_no = gstin;
      payload.company_name = companyName || contactName;
    }
    return payload;
  };

  try {
    const res = await zohoRequest({
      method: "POST",
      url: `${ZOHO_BASE}/contacts`,
      data: buildPayload(name),
      headers: getZohoHeaders()
    });
    return res.data.contact;
  } catch (err) {
    // If contact name already exists (Zoho code 3062)
    if (err.response?.data?.code === 3062) {
      console.warn(`⚠️ Contact "${name}" already exists in Zoho. Searching to reuse it...`);
      const existing = await exports.searchZohoCustomer({ name });
      if (existing) {
        return existing;
      }

      // If search didn't return it, create with unique mobile/timestamp suffix
      const uniqueSuffix = mobile ? ` (${mobile.slice(-4)})` : ` (${Date.now().toString().slice(-4)})`;
      const fallbackName = `${name}${uniqueSuffix}`;
      console.log(`Creating contact with unique name: ${fallbackName}`);

      const retryRes = await zohoRequest({
        method: "POST",
        url: `${ZOHO_BASE}/contacts`,
        data: buildPayload(fallbackName),
        headers: getZohoHeaders()
      });
      return retryRes.data.contact;
    }
    throw err;
  }
};

exports.updateZohoCustomer = async (contactId, data) => {
  try {
    const payload = {
      contact_name: data.name,
      phone: data.mobile,
      email: data.email,
      gst_treatment: data.isBusiness ? "business_gst" : "consumer",
      billing_address: {
        address: data.address?.address || data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zip: data.address?.zip || data.address?.pinCode || "",
        country: "India"
      },
      shipping_address: {
        address: data.address?.address || data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zip: data.address?.zip || data.address?.pinCode || "",
        country: "India"
      }
    };

    if (data.isBusiness && data.gstin) {
      payload.gst_no = data.gstin;
      payload.company_name = data.companyName || data.name;
    }

    const res = await zohoRequest({
      method: "PUT",
      url: `${ZOHO_BASE}/contacts/${contactId}`,
      data: payload,
      headers: getZohoHeaders()
    });

    return res.data.contact;
  } catch (err) {
    console.warn(`Could not update contact ${contactId}:`, err.response?.data?.message || err.message);
    return null;
  }
};

mobile email am store agala da deii if sale in hand vanthalea nee ivoice ah close pannidanum da deii and then innonu enaku zoho books la razorpay ah integrate panniruken payment anga capture aytunalea zoho books la epd reflect agum antha invoice ku reflect aganum da deii 
aprm 3477920000000210001 ithu test account oda ware house 