import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassowrd from '../pages/ForgotPassowrd'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import SearchProduct from '../pages/SearchProduct'
import ContactUsPage from '../pages/ContactUsPage'
import ServiceRequest from '../pages/ServiceRequest'
import CustomerSupport from '../pages/CustomerSupport'
import ProductRegistration from '../pages/ProductRegistration'
import AuthorizedDealer from '../pages/AuthorizedDealer'
import AuthorizedServiceCenter from '../pages/AuthorizedServiceCenter'
import Membership from '../pages/MemberShip'
import AdminApplications from '../pages/AdminApplications'
import DealerApplications from '../pages/AdminDealer'
import Success from '../pages/Success'
import Cancel from '../pages/Cancel'
import OrderPage from '../pages/OrderPage'
import AllOrder from '../pages/AllOrder'
import Order  from '../pages/order'
import AdminEnquiriesMsg from '../pages/AdminCutomerSupport'
import ComplaintMessages from '../pages/AdminComplaintPage'
import ContactUsMessages from '../pages/AdminContactUs'
import AdminProductRegistration from '../pages/AdminProductRegistration'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsAndConditions from '../pages/TermsAndConditions'
import RefundPolicy from '../pages/RefundPolicy'
import ShippingPolicy from '../pages/ShippingPolicy'
import ResetPassword from '../pages/ResetPassword'
import CheckoutPage from '../pages/CheckoutPage'
import CareerPage from '../pages/CareerPage'
import UserProfile from '../components/UserProfile'
import AboutUs from '../pages/AboutUs'
import BlogPage from '../pages/BlogPage'
import BlogPost from '../pages/BlogPost'
import CareerApplications from '../pages/AdminCareer'
import OrderTracking from '../pages/OrderTracking'
import Dashboard from '../pages/Dashboard'
import ReturnedProducts from '../pages/ReturnedProducts'
import AddCategory from '../pages/addCategoryProduct'
import PricingPolicy from '../pages/PricingPolicy'
import NotFound from '../pages/NotFound'
import AllCartSummary from '../pages/allCartSummary'
import CookiePage from '../pages/cookiepage'
import AddParentCategory from '../pages/addParentCategory'
import AllBlogs from '../pages/allBlogs'
import AllOfferPosters from '../pages/allOfferPosters'
import RelatedProductsPage from '../pages/RelatedProductsPage'
import WishlistView from '../pages/WishlistView'
import AdminBlog from '../pages/adminBlog'



const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassowrd/>
            },
            {
                path : "sign-up",
                element : <SignUp/>
            },
            {
                path : "product-category",
                element : <CategoryProduct/>
            },
            {
                path : "product/:id",
                element : <ProductDetails/>
            },
            {
                path : 'cart',
                element : <Cart/>
            },
            {
                path : "search",
                element : <SearchProduct/>
            },
            {
                path : "admin-panel",
                element : <AdminPanel/>,
                children : [
                    {
                        path : "dashboard",
                        element : <Dashboard/>
                    },
                    {
                        path : "all-users",
                        element : <AllUsers/>
                    },
                    {
                        path : "all-products",
                        element : <AllProducts/>
                    },
                    {
                      path : "all-categories",
                      element : <AddCategory/>
                    },
                    {
                        path : "AdminApplications",
                        element : <AdminApplications/>
                    },
                    {
                        path : "all-dealer-applications",
                        element : <DealerApplications/>
                    },
                    {
                        path : "all-orders",
                        element : <AllOrder/>
                    },
                    {
                        path : "orders",
                        element : <Order/>
                    },
                   
                    {
                        path : "all-enquiries",
                        element : <AdminEnquiriesMsg/>
                    },
                    {
                        path : "all-complaints",
                        element : <ComplaintMessages/>
                    },
                    {
                        path : "all-contactus",
                        element : <ContactUsMessages/>
                    },
                    {
                        path : "all-product-registration",
                        element : <AdminProductRegistration/>

                    },
                     {
                        path : "all-careers",
                        element : <CareerApplications/>
                    },
                    {
                       path : "all-returned-products",
                       element : <ReturnedProducts/>
                   },
{
                    path : "all-cart-items",
                    element : <AllCartSummary/>
                   },
                   {
                    path:"all-cookies-page",
                    element:<CookiePage/>
                   },
                   {
                    path:"add-parent-category",
                    element:<AddParentCategory/>
                   },
                   {
                    path:"upload-blogs",
                    element:<AllBlogs/>
                   },
                   {
                    path:"all-offerposter",
                    element:<AllOfferPosters/>
                   }


                ]
            },
 		{
		path:'adminBlog',
                element:<AdminBlog/>,
                children: [
                {
                    path :"upload-blogs",
                    element : <AllBlogs/>
                },
                ]
            },
            {
                path : 'success',
                element : <Success/>
            },
            {
                path : "cancel",
                element : <Cancel/>
            },
            {
                path : 'order',
                element : <OrderPage/>
            },
            {
                path: "order/:orderId", // Add this route for order tracking
                element: <OrderTracking/>, // Add the OrderTracking component
              },
             {
                path :"blog-page",
                element: <BlogPage/>
            },
            {
                path :"blog-post/:id",
                element: <BlogPost/>
            },
            {
                path : "ContactUsPage",
                element: <ContactUsPage/>
            },
            {
                path : "ServiceRequest",
                element : <ServiceRequest/>
            },
            {
                path : "CustomerSupport",
                element : <CustomerSupport/>
            },
            {
                path : "ProductRegistration",
                element : <ProductRegistration/>
            },
            {
                path : "AuthorizedDealer",
                element : <AuthorizedDealer/>
            },
            {
                path : "AuthorizedServiceCenter",
                element : <AuthorizedServiceCenter/>
            },
		{
                path : "PricingPolicy",
                element : <PricingPolicy/>
            },
            {
                path : "MemberShip",
                element : <Membership/>
            },
                 {
                path : "PrivacyPolicy",
                element : <PrivacyPolicy/>
            },
		{
                path : "PricingPolicy",
                element : <PricingPolicy/>
            },
            {
                path : "TermsAndConditions",
                element : <TermsAndConditions/>
            },
            {
                path : "RefundPolicy",
                element : <RefundPolicy/>
            },
            {
                path : "ShippingPolicy",
                element : <ShippingPolicy/>
            },
                {
                path : "reset-password/:token",
                element : <ResetPassword/>
            },
                {
                path : "checkout",
                element : <CheckoutPage/>
            },
             {
                path : "CareerPage",
                element : <CareerPage/>
            },
            {
                path : "AboutUs",
                element : <AboutUs/>
            },
                {
                path : "user-Profile",
                element : <UserProfile/>
            },
		 {
                path: '*',
                element: <NotFound />,
            },
{
                path: '/related-products',
                element: <RelatedProductsPage />
            },
                      {
                path: '/wishlist',
                element: <WishlistView/>
            }
                   
        ]
    }
])


export default router