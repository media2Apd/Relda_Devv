// import React from 'react';
// import CategoryList from '../components/CategoryList';
// import BannerProduct from '../components/BannerProduct';
// import VerticalCardProduct from '../components/VerticalCardProduct';
// import CookieConsent from '../components/CookieConsent'; // Import the CookieConsent component

// const Home = () => {
//   return (
//     <div>
//       <CookieConsent /> {/* Include the CookieConsent component */}
//       <CategoryList />
//       <BannerProduct />
//       <VerticalCardProduct category={"televisions"} heading={"Televisions"} />
//       <VerticalCardProduct category={"tower fans"} heading={"Tower Fans"} />
//       <VerticalCardProduct category={"kettles"} heading={"Kettles"} /> 
//     </div>
//   );
// }

// export default Home;

import React, { useEffect, useState } from 'react';

import CategoryList from '../components/CategoryList';
import BannerProduct from '../components/BannerProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';
import CookieConsent from '../components/CookieConsent'; // Import the CookieConsent component
import SummaryApi from '../common';
import RelatedProducts from './RelatedProducts';
import { Helmet } from 'react-helmet';

const Home = () => {
  const [categories, setCategories] = useState([]); // Updated state variable
  const fetchCategories = async () => {
    try {
      const response = await fetch(SummaryApi.getProductCategory.url);
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories); // Save fetched categories
      } else {
        console.error("Error fetching categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCategories(); // Call the fetch function on component mount
  }, []);
  return (
    <div>
      <Helmet>

                  {/* Schema Markup */}
                <script type="application/ld+json">
                {`
                  {
                    "@context": "https://schema.org",           
                    "@type": "LocalBusiness",
                    "name": "RELDA India",
                    "url": "https://www.reldaindia.com",
                    "logo": "https://www.reldaindia.com/logo192.png",
                    "sameAs": [
                      "https://www.facebook.com/reldaindia",
                      "https://www.instagram.com/reldaindia/",
                      "http://www.youtube.com/@Relda_India"
                    ],
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": "Plot No 17A, Majestic Avenue, Krishna Nagar, Madhavaram Milk Colony, Chennai, Tamilnadu 600051",
                      "addressLocality": "Chennai",
                      "addressRegion": "TN",
                      "postalCode": "600051",
                      "addressCountry": "IN"
                    },
                    "telephone": "+91-9884890934"
                  }
                `}
                </script>
            </Helmet>
      <CookieConsent /> {/* Include the CookieConsent component */}
      <CategoryList />
      <BannerProduct />
<RelatedProducts />
      {categories.map((category) => {
        if (category.productCount > 0) {
          return (
        <VerticalCardProduct
          key={category._id}
          category={category.value}
          heading={category.label}
        />
      )}})}
         </div>
  );
}

export default Home;