import React from "react";
import Slider from "react-slick";
import ProductCardStyleOneTwo from "./Cards/ProductCardStyleOneTwo";
import ViewMoreTitle from "./ViewMoreTitle";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SectionStyleThreeHomeTwo({
  className,
  sectionTitle,
  seeMoreUrl,
  products = [],
  showProducts,
}) {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={`section-style-one ${className || ""}`}>
      <ViewMoreTitle categoryTitle={sectionTitle} seeMoreUrl={seeMoreUrl}>
        <div className="products-section w-full overflow-hidden">
          <Slider {...sliderSettings}>
            {products.slice(0, showProducts).map((product) => (
              <div
                data-aos="fade-up"
                key={product.id}
                className="px-2 flex justify-center"
              >
                <ProductCardStyleOneTwo datas={product} />
              </div>
            ))}
          </Slider>
        </div>
      </ViewMoreTitle>
    </div>
  );
}
