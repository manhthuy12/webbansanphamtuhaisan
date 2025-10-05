import React, { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import { getCategories } from "../../api/categoryApi";
import Checkbox from "../Helpers/Checkbox";
import "react-range-slider-input/dist/style.css";

export default function ProductsFilter({
  filters,
  checkboxHandler,
  volume,
  volumeHandler,
  storage,
  filterstorage,
  className,
  filterToggle,
  filterToggleHandler,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.content.reverse());
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <div
        className={`filter-widget w-full fixed lg:relative left-0 top-0 h-screen z-10 lg:h-auto overflow-y-scroll lg:overflow-y-auto bg-white px-[30px] pt-[40px] ${
          className || ""
        }  ${filterToggle ? "block" : "hidden lg:block"}`}
      >
        <div className="filter-subject-item pb-10 border-b border-qgray-border">
          <div className="subject-title mb-[30px]">
            <h1 className="text-black text-base font-500">Danh mục sản phẩm</h1>
          </div>
          <div className="filter-items">
            <ul>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`item flex justify-between items-center mb-5 ${
                    filters.categoryIdList?.includes(category.id)
                      ? "font-bold text-blue-600"
                      : ""
                  }`} // Tô đậm và thay đổi màu khi checkbox được chọn
                  onClick={() =>
                    checkboxHandler({ target: { id: category.id } })
                  } // Xử lý nhấp vào danh mục
                >
                  <div className="flex space-x-[14px] items-center cursor-pointer">
                    <div>
                      <Checkbox
                        id={category.id}
                        name={category.name}
                        handleChange={(e) => checkboxHandler(e)}
                        checked={
                          filters.categoryIdList
                            ? filters.categoryIdList.includes(category.id)
                            : false
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={category.name}
                        className="text-xs font-black font-400 capitalize"
                      >
                        {category.name}
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="filter-subject-item pb-10 border-b border-qgray-border mt-10">
          <div className="subject-title mb-[30px]">
            <h1 className="text-black text-base font-500">Phạm vi giá</h1>
          </div>
          <div className="price-range mb-5">
            <RangeSlider
              value={[volume.min, volume.max]}
              onInput={([min, max]) => volumeHandler({ min, max })}
              min={10000}
              max={100000000}
            />
          </div>
          <p className="text-xs text-qblack font-400">
            Giá: {formatCurrency(volume.min)} - {formatCurrency(volume.max)}
          </p>
        </div>
        <button
          onClick={filterToggleHandler}
          type="button"
          className="w-10 h-10 fixed top-5 right-5 z-50 rounded  lg:hidden flex justify-center items-center border border-qred text-qred"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
