import React, { useState, useEffect } from "react";
import { getCategories } from "../../../api/categoryApi";
import { getProducts } from "../../../api/productApi";
import { Input } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";

export default function SearchBox({ className, type }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả danh mục");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.content);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchTerm.trim()) {
        setProducts([]);
        setIsDropdownVisible(false);
        return;
      }

      try {
        const data = await getProducts({ name: searchTerm });
        setProducts(data.content);
        setIsDropdownVisible(data.content.length > 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < averageRating ? (
          <StarFilled key={i} style={{ color: "#fadb14" }} />
        ) : (
          <StarOutlined key={i} />
        )
      );
    }
    return stars;
  };

  return (
    <div
      className={`relative w-full h-full flex items-center border border-qgray-border bg-white ${
        className || ""
      }`}
    >
      <div className="flex-1 h-full">
        <form action="#" className="h-full">
          <Input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownVisible(true)}
            onBlur={() => setTimeout(() => setIsDropdownVisible(false), 150)}
          />
        </form>
      </div>
      <div className="w-[1px] h-[22px] bg-qgray-border"></div>

      <button
        className={`w-[93px] h-full text-sm font-600 ${
          type === 3 ? "bg-qh3-blue text-white" : "search-btn"
        }`}
        type="button"
      >
        Tìm kiếm
      </button>

      {isDropdownVisible && products.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto z-50 p-2">
          {products.map((product) => (
            <a
              href={`/single-product/${product.id}`}
              key={product.id}
              className="flex items-center space-x-4 p-2 hover:bg-gray-100"
              onMouseDown={(e) => e.preventDefault()}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-2">
                  {product.salePrice < product.price ? (
                    <>
                      <span className="text-xs text-gray-500 line-through">
                        {product.price.toLocaleString()}₫
                      </span>
                      <span className="text-xs font-semibold text-red-600">
                        {product.salePrice.toLocaleString()}₫
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-gray-800">
                      {product.price.toLocaleString()}₫
                    </span>
                  )}
                </div>
                <div className="flex items-center text-yellow-500 text-sm">
                  {renderStars(product.averageRating)}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
