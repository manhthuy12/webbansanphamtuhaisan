import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import { getCategories } from "../../api/categoryApi";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const params = {
          page: 0,
          size: 16,
        }; // Thêm tham số page=0 và size=16
        const data = await getCategories(params);
        setCategories(data.content.reverse());
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories-section-wrapper w-full">
      <div className="container-x mx-auto">
        <div className="w-full categories-items">
          <div className="grid xl:grid-cols-8 sm:grid-cols-4 grid-cols-2 gap-10 mb-[46px]">
            {categories.map((category) => (
              <div
                key={category?.id}
                className="item w-full group cursor-pointer"
              >
                <Link to={`/all-products?categoryId=${category?.id}`}>
                  <div className="w-full flex justify-center">
                    <div className="w-[110px] h-[110px] rounded-full bg-[#EEF1F1] group-hover:bg-[#FFBB38] mb-2.5 flex justify-center items-center">
                      <img
                        src={category?.image}
                        alt={category?.name}
                        className="w-[70px] h-[70px] object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-center">
                    <p className="text-base text-qblack whitespace-nowrap">
                      {category?.name}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
