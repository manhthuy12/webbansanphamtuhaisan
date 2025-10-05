import { useEffect, useState } from "react";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import CountDown from "../Helpers/CountDown";
import DataIteration from "../Helpers/DataIteration";
import Layout from "../Partials/Layout";
import { getProducts } from "../../api/productApi";

export default function FlashSale() {
  const { showDate, showHour, showMinute, showSecound } =
    CountDown("2025-10-04 4:00:00");
  const [products, setProducts] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          sale: true,
        };
        const data = await getProducts(params);
        setProducts(data.content);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  const getPaginatedProducts = () => {
    return products.slice(0, products.length);
  };

  return (
    <Layout>
      <div className="flashsale-wrapper w-full">
        <div className="container-x mx-auto">
          <div className="w-full">
            <div
              style={{
                background: `url(${import.meta.env.VITE_PUBLIC_URL
                  }/assets/images/flash-sale-ads.png) no-repeat`,
                backgroundSize: "cover",
              }}
              data-aos="fade-right"
              className="flash-ad w-full h-[400px] flex sm:justify-end justify-center items-center mb-10"
            >
              <div className="sm:mr-[75px]">
                <div className="countdown-wrapper w-full flex sm:space-x-6 space-x-3 sm:justify-between justify-evenly">
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-base text-[#EB5757]">
                        {showDate}
                      </span>
                    </div>
                    <p className="sm:text-[18px] text-xs font-500 text-center leading-8 text-white">
                      Ngày
                    </p>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-base text-[#2F80ED]">
                        {showHour}
                      </span>
                    </div>
                    <p className="sm:text-[18px] text-xs font-500 text-center leading-8 text-white">
                      Giờ
                    </p>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-base text-[#219653]">
                        {showMinute}
                      </span>
                    </div>
                    <p className="sm:text-[18px] text-xs font-500 text-center leading-8 text-white">
                      Phút
                    </p>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-base text-[#EF5DA8]">
                        {showSecound}
                      </span>
                    </div>
                    <p className="sm:text-[18px] text-xs font-500 text-center leading-8 text-white">
                      Giây
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="products grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
                {getPaginatedProducts().map((product) => (
                    <ProductCardStyleOne key={product.id} datas={product} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
