import { useEffect, useState } from "react";

// Dummy fallback (for now)
import banner1 from "../assest/banner/Relda Tv home page banner Demo.jpg";
import banner2 from "../assest/banner/Relda Tv home page banner Demo.jpg";

const DUMMY_BANNERS = [
  {
    id: 1,
    imageUrl: banner1,
  },
    {
    id: 2,
    imageUrl: banner2,
  },
];

const useBannerImages = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // 🔜 replace with real API later
        // const res = await fetch("/api/banners");
        // const data = await res.json();

        // if (data?.length) {
        //   setBanners(data);
        // } else {
        //   setBanners(DUMMY_BANNERS);
        // }

        // TEMP – dummy
        setBanners(DUMMY_BANNERS);
      } catch (error) {
        console.error("Banner fetch failed:", error);
        setBanners(DUMMY_BANNERS);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return { banners, loading };
};

export default useBannerImages;
