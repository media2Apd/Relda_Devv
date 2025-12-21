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
import RecentlyViewProducts from './RecentlyViewProducts';
import { Helmet } from 'react-helmet';
import TopSellingProducts from '../components/TopSellingProducts';
import HowToShopBanner from '../components/HowToShopBanner';

const Home = () => {
  const [categories, setCategories] = useState([]); // Updated state variable
  const fetchCategories = async () => {
    try {
      const response = await fetch(SummaryApi.getActiveProductCategory.url);
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

  const insertIndex = Math.floor(categories.length / 2);

  return (
    <div className='overflow-hidden'>
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
      <BannerProduct type="home" />
      <RecentlyViewProducts />
      {categories.map((category, index) => {
        if (category.productCount === 0) return null;

        return (
          <React.Fragment key={category._id}>
            {/* CATEGORY SECTION */}
            <VerticalCardProduct
              category={category.value}
              heading={category.label}
            />

            {/* 👇 INSERT TOP SELLING IN BETWEEN */}
            {index === insertIndex && <TopSellingProducts />}
          </React.Fragment>
        );
      })}
      <BannerProduct type="bottom" />
      <HowToShopBanner />

    </div>
  );
}

export default Home;