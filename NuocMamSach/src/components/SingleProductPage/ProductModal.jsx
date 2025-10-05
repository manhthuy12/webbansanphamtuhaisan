import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import ProductView from "./ProductView"; // Component hiển thị sản phẩm

export default function ProductModal({ isOpen, onClose, selectedProduct }) {
  if (!isOpen || !selectedProduct) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Ban đầu mờ và nhỏ hơn
    visible: { opacity: 1, scale: 1 }, // Khi mở ra hoàn toàn
    exit: { opacity: 0, scale: 0.8 }, // Khi đóng lại
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // Đóng modal khi nhấp vào vùng overlay
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <motion.div
        className="bg-white w-full max-w-4xl p-6 relative rounded-lg shadow-lg"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút Close */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Hiển thị sản phẩm trong ProductView */}
        <ProductView product={selectedProduct} />
      </motion.div>
    </div>,
    document.body // Render modal ra ngoài cây DOM chính tại đây
  );
}
