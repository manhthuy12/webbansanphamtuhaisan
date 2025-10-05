import { Link } from "react-router-dom";
import Facebook from "../../../Helpers/icons/Facebook";
import Instagram from "../../../Helpers/icons/Instagram";
import Youtube from "../../../Helpers/icons/Youtube";

export default function Footer({ type }) {
  return (
    <footer className="footer-section-wrapper bg-white print:hidden">
      <div className="container-x block mx-auto pt-[56px]">
        <div className="w-full flex flex-col items-center mb-[50px]">
          {/* logo area */}
          <div className="mb-[40px]">
            {type === 3 ? (
              <Link to="/">
                <h1 className="text-2xl font-bold text-gray-900">
                  NuocMamHungAn
                </h1>
              </Link>
            ) : (
              <Link to="/">
                <h1 className="text-2xl font-bold text-gray-900">
                  NuocMamHungAn
                </h1>
              </Link>
            )}
          </div>
          <div className="w-full h-[1px] bg-[#E9E9E9]"></div>
        </div>
        <div className="lg:flex justify-between mb-[50px]">
          <div className="lg:w-[424px]  ml-0 w-full mb-10 lg:mb-0">
            <h1 className="text-[18] font-500 text-[#2F2F2F] mb-5">
              Về chúng tôi
            </h1>
            <p className="text-[#9A9A9A] text-[15px] w-[247px] leading-[28px]">
              Chúng tôi biết có rất nhiều nhà phát triển ngoài kia, nhưng chúng
              tôi tự hào là một công ty hàng đầu trong ngành.
            </p>
          </div>
          <div className="flex-1 lg:flex">
            <div className="lg:w-1/2 w-full mb-10 lg:mb-0">
              <div className="mb-5">
                <h6 className="text-[18] font-500 text-[#2F2F2F]">Tính năng</h6>
              </div>
              <div>
                <ul className="flex flex-col space-y-4 ">
                  <li>
                    <Link to="/blogs">
                      <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                        Về chúng tôi
                      </span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/terms-condition">
                      <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                        Điều khoản sử dụng
                      </span>
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/all-products">
                      <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                        Sản phẩm tốt nhất
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:w-1/2 lg:flex lg:flex-col items-center w-full mb-10 lg:mb-0 ">
              <div>
                <div className="mb-5">
                  <h6 className="text-[18] font-500 text-[#2F2F2F]">
                    Liên kết chung
                  </h6>
                </div>
                <div>
                  <ul className="flex flex-col space-y-4 ">
                    <li>
                      <Link to="/blogs">
                        <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                          Tin tức
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/tracking-order">
                        <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                          Theo dõi đơn hàng
                        </span>
                      </Link>
                    </li>
                    {/* <li>
                      <Link to="/become-saller">
                        <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                          Trở thành người bán
                        </span>
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="lg:w-1/3 lg:flex lg:flex-col items-center w-full mb-10 lg:mb-0">
              <div>
                <div className="mb-5">
                  <h6 className="text-[18] font-500 text-[#2F2F2F]">Hữu ích</h6>
                </div>
                <div>
                  <ul className="flex flex-col space-y-4 ">
                    <li>
                      <Link to="/flash-sale">
                        <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                          Giảm giá chớp nhoáng
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/faq">
                        <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                          Câu hỏi thường gặp
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/about">
                        <span className="text-[#9A9A9A] text-[15px] hover:text-qblack border-b border-transparent hover:border-qblack cursor-pointer capitalize">
                          Hỗ trợ
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="bottom-bar border-t border-qgray-border lg:h-[82px] lg:flex justify-between items-center">
          <div className="flex lg:space-x-5 justify-between items-center mb-3">
            <div className="flex space-x-5 items-center">
              <a href="#">
                <Instagram className="fill-current text-qgray hover:text-qblack" />
              </a>
              <a href="#">
                <Facebook className="fill-current text-qgray hover:text-qblack" />
              </a>
              <a href="#">
                <Youtube className="fill-current text-qgray hover:text-qblack" />
              </a>
            </div>
            <span className="sm:text-base text-[10px] text-qgray font-300">
              @2025
              <a
                href="https://fashionstore.com/"
                target="_blank"
                rel="noreferrer"
                className="font-500 text-qblack mx-1"
              >
                NuocMamHungAn
              </a>
              Bản quyền thuộc về NuocMamHungAn
            </span>
          </div>
          <div className="">
            <a href="#">
              <img
                width="318"
                height="28"
                src={`${import.meta.env.VITE_PUBLIC_URL
                  }/assets/images/payment-getways.png`}
                alt="payment-getways"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
