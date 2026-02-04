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
