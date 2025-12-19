// utils/saveViewedProduct.js

export const saveViewedProduct = (productId) => {
    let viewed = JSON.parse(localStorage.getItem("viewedItems")) || [];
    if (!viewed.includes(productId)) {
      viewed.push(productId);
      if (viewed.length > 10) viewed.shift(); // limit to 10
      localStorage.setItem("viewedItems", JSON.stringify(viewed));
    }
  };
  