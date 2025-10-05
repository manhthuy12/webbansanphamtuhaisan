import { useState, useEffect } from "react";
import BreadcrumbCom from "../BreadcrumbCom";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import Layout from "../Partials/Layout";
import ProductsFilter from "./ProductsFilter";
import { getProducts } from "../../api/productApi";
import { useLocation } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AllProductPage() {
  const [filters, setFilter] = useState({});
  const [volume, setVolume] = useState({ min: 10000, max: 100000000 });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [pageable, setPageable] = useState({
    pageNumber: 0,
    pageSize: 9,
    totalPages: 1,
    totalElements: 0,
  });
  const location = useLocation();
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageable]);
  const getQueryParams = () => {
    setProducts([]);
    const params = new URLSearchParams(location.search);
    const hot = params.has("hot") ? params.get("hot") === "true" : null;
    const sale = params.has("sale") ? params.get("sale") === "true" : null;
    const categoryId = params.has("categoryId")
      ? params.get("categoryId")
      : null;
    return { hot, sale, categoryId };
  };

  useEffect(() => {
    const queryParams = getQueryParams();
    setFilter((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (queryParams.hot !== null) {
        newFilters.hot = queryParams.hot;
      }

      if (queryParams.sale !== null) {
        newFilters.sale = queryParams.sale;
      }

      if (queryParams.categoryId) {
        newFilters.categoryIdList = [Number(queryParams.categoryId)];
      }

      return newFilters;
    });
  }, [location]);

  const checkboxHandler = (e) => {
    const { id } = e.target;
    setFilter((prevState) => {
      const currentCategoryIdList = prevState.categoryIdList || [];
      if (currentCategoryIdList.includes(Number(id))) {
        return {
          ...prevState,
          categoryIdList: currentCategoryIdList.filter(
            (catId) => catId !== Number(id)
          ),
        };
      } else {
        return {
          ...prevState,
          categoryIdList: [...currentCategoryIdList, Number(id)],
        };
      }
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    console.log(filters);
    try {
      const params = {
        categoryId: filters.categoryIdList
          ? filters.categoryIdList.join(",")
          : null,
        minPrice: volume.min,
        maxPrice: volume.max,
        ...(filters.hot !== undefined && { hot: filters.hot }),
        ...(filters.sale !== undefined && { sale: filters.sale }),
      };
      const data = await getProducts(params);
      setProducts(data.content);
      setFilteredProducts(data.content);
      setPageable({
        pageNumber: 0,
        pageSize: pageable.pageSize,
        totalPages: Math.ceil(data.totalElements / pageable.pageSize),
        totalElements: data.totalElements,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (sortKey) => {
    const sorted = [...filteredProducts].sort((a, b) => {
      if (sortKey === "price") {
        return a.price - b.price;
      } else if (sortKey === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    setFilteredProducts(sorted);
  };

  useEffect(() => {
    fetchProducts();
  }, [filters.categoryIdList, volume]);

  useEffect(() => {
    sortProducts(sortBy);
  }, [sortBy, products]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageable.totalPages) {
      setPageable((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const getPaginatedProducts = () => {
    const startIdx = pageable.pageNumber * pageable.pageSize;
    const endIdx = Math.min(
      startIdx + pageable.pageSize,
      filteredProducts.length
    );
    return filteredProducts.slice(startIdx, endIdx);
  };
  const getPaginationNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pageable.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };
  return (
    <Layout>
      <div className="products-page-wrapper w-full">
        <div className="container-x mx-auto">
          {/* <BreadcrumbCom /> */}
          <div className="w-full lg:flex lg:space-x-[30px]">
            <div className="lg:w-[270px]">
              <ProductsFilter
                filters={filters}
                checkboxHandler={checkboxHandler}
                volume={volume}
                volumeHandler={(value) => setVolume(value)}
                storage={filters.storage}
                filterstorage={(value) =>
                  setFilter({ ...filters, storage: value })
                }
              />
              {/* ads */}
              <div className="w-full hidden lg:block h-[295px]">
                <img
                  src={`https://i.pinimg.com/736x/eb/09/e2/eb09e26f4f9fda0160a00278ca8a2eee.jpg`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="products-sorting w-full bg-white md:h-[70px] flex md:flex-row flex-col md:space-y-0 space-y-5 md:justify-between md:items-center p-[30px] mb-[40px]">
                <div>
                  <p className="font-400 text-[13px]">
                    <span className="text-qgray">Hiển thị</span>{" "}
                    {Math.min(
                      pageable.pageNumber * pageable.pageSize + 1,
                      pageable.totalElements
                    )}{" "}
                    -{" "}
                    {Math.min(
                      (pageable.pageNumber + 1) * pageable.pageSize,
                      pageable.totalElements
                    )}{" "}
                    <span className="text-qgray">của</span>{" "}
                    {pageable.totalElements} sản phẩm
                  </p>
                </div>
                <div className="flex space-x-3 items-center">
                  <span className="font-medium text-[14px] text-gray-700">
                    Sắp xếp theo:
                  </span>
                  <div className="relative">
                    <select
                      onChange={(e) => handleSortChange(e.target.value)}
                      value={sortBy}
                      className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="name">Tên Sản Phẩm</option>
                      <option value="price">Giá Sản Phẩm</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5 mb-[40px]">
                {loading ? (
                  <p>Đang cập nhật...</p>
                ) : (
                  getPaginatedProducts().map((product) => (
                    <ProductCardStyleOne key={product.id} datas={product} />
                  ))
                )}
              </div>

              <div className="pagination flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => handlePageChange(pageable.pageNumber - 1)}
                  disabled={pageable.pageNumber === 0}
                  className={`px-4 py-2 rounded-md text-white ${
                    pageable.pageNumber === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#FFBB38] hover:bg-[#FFBB38]"
                  }`}
                >
                  {/* Mũi tên trái từ react-icons */}
                  <FaChevronLeft className="h-5 w-5 text-black" />
                </button>

                {getPaginationNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page - 1)}
                    className={`px-4 py-2 rounded-md ${
                      pageable.pageNumber + 1 === page
                        ? "bg-[#FFBB38] text-black"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pageable.pageNumber + 1)}
                  disabled={pageable.pageNumber === pageable.totalPages - 1}
                  className={`px-4 py-2 rounded-md text-white ${
                    pageable.pageNumber === pageable.totalPages - 1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#FFBB38] hover:bg-[#FFBB38]"
                  }`}
                >
                  {/* Mũi tên phải từ react-icons */}
                  <FaChevronRight className="h-5 w-5 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
