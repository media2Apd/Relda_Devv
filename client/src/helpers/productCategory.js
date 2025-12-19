// const productCategory = [
//     { id : 1, label : "Televisions", value : "televisions"},
//     { id : 2, label : "Tower Fans", value : "tower fans"},
//     { id : 3, label : "Kettles", value : "kettles"},
// ]


// export default productCategory

import SummaryApi from '../common';

let productCategory = [];

(async () => {
  try {
    const response = await fetch(SummaryApi.getProductCategory.url);
    const data = await response.json();

    if (data.success) {
      productCategory = data.categories; // Assign fetched categories to the variable
    } else {
      console.error("Error fetching categories:", data.message);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
})();

export default productCategory;
