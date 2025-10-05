import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/productApi";

export default function Banner({ className }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page: 0,
          size: 2,
        };
        const response = await getProducts(params);
        setProducts(response.content);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className={`w-full ${className || ""}`}>
        <div className="container-x mx-auto">
          <div className="main-wrapper w-full">
            <div className="banner-card xl:flex xl:space-x-[30px] xl:h-[600px] mb-[30px]">
              <div data-aos="fade-right" className="xl:w-1/2 w-full h-full">
                <Link to={`/single-product/${products[0]?.id}`}>
                  <picture>
                    <source
                      media="(min-width:1025px)"
                      srcSet={
                        "https://nuocmamongky.vn/upload/galleries//nuoc-mam-ong-ky-la-nuoc-mam-cot-nguyen-chat-chay-ra-dau-tien-khong-pha-tron-voi-nuoc-rut-ra-lan-2-lan-3-QOMX1684288804.jpg"
                      }
                    />
                    <img
                      src={
                        "https://hinh365.com/wp-content/uploads/2020/06/485d4fc62e76b1c2941505f12ac3ef42.jpg"
                      }
                      alt=""
                      className="w-[569px] h-[548px] object-cover"
                    />
                  </picture>
                </Link>
              </div>
              <div
                data-aos="fade-left"
                className="w-1/2 flex xl:flex-col flex-row xl:space-y-[30px] h-full"
              >
                <div className="w-full">
                  <Link to={`/single-product/${products[1]?.id}`}>
                    <img
                      src={
                        "https://nuocmamhaitrung.com/wp-content/uploads/2016/06/nuoc_mam_nguyen_chat_ngon.jpg"
                      }
                      alt=""
                      className="w-[569px] h-[548px] object-cover"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
