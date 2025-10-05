import { useEffect, useState } from "react";
import BlogCard from "../Helpers/Cards/BlogCard";
import DataIteration from "../Helpers/DataIteration";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { getNews } from "../../api/newsApi";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const params = {
          page: 0,
          size: 10,
        };
        const data = await getNews(params);
        setBlogs(data.content);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu blog:", error);
      }
    };

    fetchBlogs();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="blogs-wrapper w-full-width">
        <div className="title-bar">
          <PageTitle
            title="Tin Tức Của Chúng Tôi"
            breadcrumb={[
              { name: "Trang chủ", path: "/" },
              { name: "Tin tức", path: "/blogs" },
            ]}
          />
        </div>
      </div>

      <div className="w-full py-[60px]">
        <div className="container-x mx-auto">
          <div className="w-full">
            <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-[30px] gap-5">
              <DataIteration
                datas={blogs}
                startLength={0}
                endLength={blogs.length}
              >
                {({ datas }) => (
                  <div
                    data-aos="fade-up"
                    key={datas.id}
                    className="item w-full"
                  >
                    <BlogCard datas={datas} />
                  </div>
                )}
              </DataIteration>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
