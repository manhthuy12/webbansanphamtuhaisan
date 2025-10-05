import React, { useState, useEffect } from "react";
import LayoutHomeTwo from "../Partials/LayoutHomeTwo";
import SectionStyleThreeHomeTwo from "../Helpers/SectionStyleThreeHomeTwo";
import SectionStyleTwo from "../Helpers/SectionStyleTwoHomeTwo";
import ViewMoreTitle from "../Helpers/ViewMoreTitle";
import Banner from "./Banner";
import CampaignCountDown from "./CampaignCountDown";
import CategoriesSection from "./CategoriesSection";
import { getProducts, getProductSuggestions } from "../../api/productApi";
import { createChatRoom } from "../../api/chatRoomApi";
import { useSelector } from "react-redux";
import { MessageOutlined } from "@ant-design/icons";
import ChatBox from "./ChatBox";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function HomeTwo() {
  const [productHots, setProductHots] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [productNews, setProductNews] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [suggestions, setSuggestions] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialProducts = async () => {
      const paramsHot = { hot: true, page: 0, size: 3 };
      const paramsSale = { sale: true, page: 0, size: 3 };
      const paramsNew = { sale: true, page: 0, size: 6 };

      window.scrollTo(0, 0);

      const requests = [
        { request: getProducts(paramsHot), setter: setProductHots },
        { request: getProducts(paramsSale), setter: setProductSales },
        { request: getProducts(paramsNew), setter: setProductNews },
      ];

      requests.forEach(async (req, index) => {
        try {
          const result = await req.request;
          req.setter(result.content);
        } catch (error) {
          console.error(`Failed to fetch data for API #${index + 1}:`, error);
        }
      });
    };
    fetchInitialProducts();
  }, []);

  useEffect(() => {
    if (!userInfo?.id) return;

    const fetchSuggestions = async () => {
      try {
        const result = await getProductSuggestions(userInfo.id);
        setSuggestions(result);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };
    fetchSuggestions();
  }, [userInfo]);

  // Hàm gọi API lấy thông tin phòng chat và toggle hiển thị chat box
  const toggleChatBox = async () => {
    if (!userInfo) {
      message.warning("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    setLoadingChat(true);
    setIsChatOpen(false);

    try {
      const chatRoomData = await createChatRoom(userInfo.id);
      setMessages(chatRoomData.messages ?? []);
      setChatRoomId(chatRoomData.id);
      setLoadingChat(false);
      setIsChatOpen(true);
    } catch (error) {
      console.error("Failed to fetch chat room:", error);
      setLoadingChat(false);
    }
  };

  return (
    <LayoutHomeTwo>
      <Banner className="banner-wrapper mb-[46px]" />
      {suggestions && suggestions.length > 2 && (
        <SectionStyleThreeHomeTwo
          products={suggestions}
          showProducts={Math.min(suggestions.length, 3)}
          sectionTitle="Có thể bạn quan tâm"
          seeMoreUrl="/all-products"
          className="feature-products mb-[60px]"
        />
      )}
      <ViewMoreTitle
        className="my-categories mb-[60px]"
        seeMoreUrl="/all-products"
        categoryTitle="Danh mục sản phẩm"
      >
        <CategoriesSection />
      </ViewMoreTitle>
      {productHots && productHots.length > 2 && (
        <SectionStyleThreeHomeTwo
          products={productHots}
          showProducts={productHots.length}
          sectionTitle="Sản phẩm nổi bật"
          seeMoreUrl="/all-products?hot=true"
          className="new-products mb-[60px]"
        />
      )}

      <CampaignCountDown className="mb-[60px]" lastDate="2025-10-04 4:00:00" />
      {productSales && productSales.length > 2 && (
        <SectionStyleThreeHomeTwo
          products={productSales}
          showProducts={productSales.length}
          sectionTitle="Giảm giá phổ biến"
          seeMoreUrl="/all-products?sale=true"
          className="feature-products mb-[60px]"
        />
      )}
      <ViewMoreTitle
        className="top-selling-product mb-[60px]"
        seeMoreUrl="/all-products"
        categoryTitle="Hàng mới về"
      >
        <SectionStyleTwo products={productNews} />
      </ViewMoreTitle>
      {/* Toggle chat box visibility */}
      {!isChatOpen && !loadingChat && (
        <div
          className="fixed bottom-5 right-5 bg-yellow-500 p-3 rounded-full shadow-lg cursor-pointer hover:bg-yellow-600 transition-colors duration-300"
          onClick={toggleChatBox}
          style={{ zIndex: 1000 }}
        >
          <MessageOutlined style={{ fontSize: "24px", color: "black" }} />
        </div>
      )}
      {/* Chat Box */}
      {isChatOpen && chatRoomId && messages && (
        <div style={{ zIndex: 1100 }}>
          <ChatBox
            onClose={() => setIsChatOpen(false)}
            messages={messages}
            chatRoomId={chatRoomId}
          />
        </div>
      )}
    </LayoutHomeTwo>
  );
}
