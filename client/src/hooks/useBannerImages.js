// import { useEffect, useState } from "react";

// // Dummy fallback (for now)
// import topBanner1 from "../assest/banner/Relda Tv home page banner Demo2.jpg";
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

// Desktop images
import homeDesktop1 from "../assest/banner/DeskTopBanner1.jpg";
// import homeDesktop2 from "../assest/banner/DeskTopBanner2.jpg";
import bottomDesktop1 from "../assest/banner/DeskBottomBanner1.png";

// Mobile images
import homeMobile1 from "../assest/banner/MobileBanner1.jpg";
import bottomMobile1 from "../assest/banner/MobileBanner1.jpg";

const HOME_BANNERS = [
  {
    id: 1,
    desktopImage: homeDesktop1,
    mobileImage: homeMobile1,
  },
  // {
  //   id: 2,
  //   desktopImage: homeDesktop2,
  //   mobileImage: homeMobile1,
  // },
];

const BOTTOM_BANNERS = [
  {
    id: 101,
    desktopImage: bottomDesktop1,
    mobileImage: bottomMobile1,
  },
];

const useBannerImages = (type = "home") => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (type === "home") {
        setBanners(HOME_BANNERS);
      } else if (type === "bottom") {
        setBanners(BOTTOM_BANNERS);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  return { banners, loading };
};

export default useBannerImages;
