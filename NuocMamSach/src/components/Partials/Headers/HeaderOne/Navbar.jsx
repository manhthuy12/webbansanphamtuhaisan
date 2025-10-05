import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Arrow from "../../../Helpers/icons/Arrow";
import { getCategories } from "../../../../api/categoryApi";

export default function Navbar({ className, type }) {
  const [categoryToggle, setToggle] = useState(false);
  const [elementsSize, setSize] = useState("0px");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const params = {
          page: 0,
          size: 16,
        };
        const data = await getCategories(params);
        setCategories(data.content.reverse());
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handler = () => {
    setToggle(!categoryToggle);
  };

  useEffect(() => {
    if (categoryToggle) {
      const getItems = document.querySelectorAll(`.categories-list li`).length;
      if (categoryToggle && getItems > 0) {
        setSize(`${42 * getItems}px`);
      }
    } else {
      setSize(`0px`);
    }
  }, [categoryToggle]);

  return (
    <div
      className={`nav-widget-wrapper w-full  h-[60px] relative z-20 ${
        type === 3 ? "bg-qh3-blue" : "bg-qyellow"
      }  ${className || ""}`}
    >
      <div className="container-x mx-auto h-full">
        <div className="w-full h-full relative">
          <div className="w-full h-full flex justify-between items-center">
            <div className="category-and-nav flex xl:space-x-7 space-x-3 items-center">
              <div className="category w-[270px] h-[53px] bg-white px-5 rounded-t-md mt-[6px] relative">
                <button
                  onClick={handler}
                  type="button"
                  className="w-full h-full flex justify-between items-center"
                >
                  <div className="flex space-x-3 items-center">
                    <span>
                      <svg
                        className="fill-current"
                        width="14"
                        height="9"
                        viewBox="0 0 14 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="14" height="1" />
                        <rect y="8" width="14" height="1" />
                        <rect y="4" width="10" height="1" />
                      </svg>
                    </span>
                    <span className="text-sm font-600 text-qblacktext">
                      Tất cả các danh mục
                    </span>
                  </div>
                  <div>
                    <Arrow
                      width="5.78538"
                      height="1.28564"
                      className="fill-current text-qblacktext"
                    />
                  </div>
                </button>
                {categoryToggle && (
                  <div
                    className="fixed top-0 left-0 w-full h-full -z-10"
                    onClick={handler}
                  ></div>
                )}
                <div
                  className="category-dropdown w-full absolute left-0 top-[53px] overflow-hidden"
                  style={{ height: `${elementsSize} ` }}
                >
                  <ul
                    className="category-list"
                    style={{
                      maxHeight: "300px", 
                      overflowY: "auto", 
                    }}
                  >
                    {categories.map((category) => (
                      <li key={category.id} className="category-item">
                        <Link to={`/all-products?categoryId=${category.id}`}>
                          <div
                            className={`flex justify-between items-center px-5 h-10 bg-white transition-all duration-300 ease-in-out cursor-pointer text-qblack ${
                              type === 3
                                ? "hover:bg-qh3-blue hover:text-white"
                                : "hover:bg-qyellow"
                            }`}
                          >
                            <div className="flex items-center space-x-6">
                              {category.image && (
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-6 h-6 object-cover"
                                />
                              )}
                              <span className="text-xs font-400">
                                {category.name}
                              </span>
                            </div>
                            <div>
                              <span>
                                <svg
                                  className="fill-current"
                                  width="6"
                                  height="9"
                                  viewBox="0 0 6 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    x="1.49805"
                                    y="0.818359"
                                    width="5.78538"
                                    height="1.28564"
                                    transform="rotate(45 1.49805 0.818359)"
                                  />
                                  <rect
                                    x="5.58984"
                                    y="4.90918"
                                    width="5.78538"
                                    height="1.28564"
                                    transform="rotate(135 5.58984 4.90918)"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="nav">
                <ul className="nav-wrapper flex xl:space-x-10 space-x-5">
                  <li className="relative">
                    <Link
                      to="/"
                      className={`flex items-center text-sm font-600 cursor-pointer ${
                        type === 3 ? "text-white" : "text-qblacktext"
                      }`}
                    >
                      <span>Trang chủ</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/all-products`}
                      className={`flex items-center text-sm font-600 cursor-pointer ${
                        type === 3 ? "text-white" : "text-qblacktext"
                      }`}
                    >
                      <span>Sản phẩm</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/blogs">
                      <span
                        className={`flex items-center text-sm font-600 cursor-pointer ${
                          type === 3 ? "text-white" : "text-qblacktext"
                        }`}
                      >
                        <span>Tin tức</span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact">
                      <span
                        className={`flex items-center text-sm font-600 cursor-pointer ${
                          type === 3 ? "text-white" : "text-qblacktext"
                        }`}
                      >
                        <span>Liên hệ</span>
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
