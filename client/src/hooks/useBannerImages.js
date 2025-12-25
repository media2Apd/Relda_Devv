// import { useEffect, useState } from "react";

// // Dummy fallback (for now)
// import topBanner1 from "../assest/banner/Relda Tv home page banner Demo.jpg";
// // import topBanner2 from "../assest/banner/Banner2.png";
// import bottomBanner2 from "../assest/banner/BottomBanner1.png";
// // import banner3 from "../assest/banner/Banner3.png";

// // Dummy for now
// const HOME_BANNERS = [
//   { id: 1, imageUrl: topBanner1 },
//   { id: 2, imageUrl: topBanner1 },
// ];

// const BOTTOM_BANNERS = [
//   { id: 101, imageUrl: bottomBanner2 },
//   // { id: 102, imageUrl: bottomBanner2 },
// ];


// const useBannerImages = (type = "home") => {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         // 🔜 later real API
//         // /api/banners?type=home | bottom | promo

//         if (type === "home") {
//           setBanners(HOME_BANNERS);
//         } else if (type === "bottom") {
//           setBanners(BOTTOM_BANNERS);
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanners();
//   }, [type]);

//   return { banners, loading };
// };

// export default useBannerImages;

import { useEffect, useState } from "react";
import SummaryApi from "../common";

const useBannerImages = (type = "home-top") => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // const res = await fetch(SummaryApi.getBanners.url, {
        //   method: SummaryApi.getBanners.method,
        // });
        const res = await fetch(
          `${SummaryApi.getBanners.url}?position=${type}`,
          { method: "GET" }
        );

        const data = await res.json();

        if (data.success) {
          // filter by position (home-top / home-bottom)
          const filtered = data.data.filter(
            (banner) => banner.position === type
          );

          setBanners(filtered);
        }
      } catch (error) {
        console.error("Error fetching banners", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [type]);

  return { banners, loading };
};

export default useBannerImages;
