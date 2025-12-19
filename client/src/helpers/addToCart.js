//import SummaryApi from "../common";
//import { toast } from 'react-toastify';

//const addToCart = async (e, id) => {
    //e?.stopPropagation();
    //e?.preventDefault();

    //try {
        //const response = await fetch(SummaryApi.addToCartProduct.url, {
            //method: SummaryApi.addToCartProduct.method,
            //credentials: 'include',  // Send cookies for session tracking if applicable
            //headers: {
                //"Content-Type": "application/json",
            //},
            //body: JSON.stringify({ productId: id }),
        //});

        //const responseData = await response.json();

        //if (responseData.success) {
            //toast.success(responseData.message);
        //}

        //if (responseData.error) {
            //toast.error(responseData.message);
        //}

        //return responseData;

    //} catch (err) {
        //toast.error("Something went wrong while adding to cart.");
    //}
//};

//export default addToCart;


import SummaryApi from "../common";
import { toast } from 'react-toastify';

const addToCart = async (e, id, navigate) => {
    e?.stopPropagation();
    e?.preventDefault();

    try {
        const response = await fetch(SummaryApi.addToCartProduct.url, {
            method: SummaryApi.addToCartProduct.method,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: id }),
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData.message);
        } else if (responseData.error) {
            toast.error(responseData.message);

            // // Debug: Log the message
            // console.log("Received message from backend:", responseData.message);

            const loginTriggers = [
                "Please Login...!",
                "Please login",
                "Login required"
            ];

            if (loginTriggers.includes(responseData.message.trim())) {
                setTimeout(() => {
                    console.log("Redirecting to login...");

                    if (typeof navigate === 'function') {
                        navigate("/login");
                    } else {
                        // ? Fallback if navigate doesn't work
                        window.location.href = "/login";
                    }

                }, 2000);
            }
        }

        return responseData;

    } catch (err) {
        console.error("Add to cart error:", err);
        toast.error("Something went wrong while adding to cart.");
    }
};

export default addToCart;