import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAddressBooksByUserId,
  deleteAddressBook,
  changeDefaultAddress, 
} from "../../../../api/addressBookApi";
import { message } from "antd";
import MapImg from "../../../../../public/assets/images/map.png";
import AddressModal from "./AddressModal";

export default function AddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [defaultAddressId, setDefaultAddressId] = useState(null);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchAddressBooks();
    }
  }, [userInfo]);

  const fetchAddressBooks = async () => {
    try {
      const addressData = await getAddressBooksByUserId(userInfo.id);
      setAddresses(addressData);
      const defaultAddress = addressData.find((address) => address.default);
      setDefaultAddressId(defaultAddress?.addressBookId || null);
    } catch (error) {
      message.error("Lỗi khi tải danh sách địa chỉ");
      console.error("Error fetching address books:", error);
    }
  };

  const handleSetDefault = async (addressBookId) => {
    try {
      await changeDefaultAddress(userInfo.id, addressBookId); 
      setDefaultAddressId(addressBookId);
      fetchAddressBooks(); 
      message.success("Đã cập nhật địa chỉ mặc định thành công!");
    } catch (error) {
      message.error("Lỗi khi thay đổi địa chỉ mặc định!");
      console.error("Error changing default address:", error);
    }
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setShowModal(true);
  };

  const handleDelete = async (addressBookId) => {
    try {
      await deleteAddressBook(addressBookId);
      message.success("Địa chỉ đã được xóa thành công!");
      fetchAddressBooks();
    } catch (error) {
      message.error("Lỗi khi xóa địa chỉ!");
      console.error("Error deleting address book:", error);
    }
  };

  const handleSaveAddress = (addressData) => {
    fetchAddressBooks();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.addressBookId}
              className={`w-full p-4 flex items-center justify-between rounded-lg shadow ${
                address.default ? "bg-yellow-100" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={MapImg}
                  alt="Avatar"
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">
                    {address.recipientName}
                  </p>
                  <p className="text-sm text-gray-500">{address.phoneNumber}</p>
                  <p className="text-sm text-gray-500">{address.email}</p>
                  <p className="text-sm text-gray-500">{`${address.address}, ${address.ward}, ${address.district}, ${address.city}`}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEdit(address)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 7.037a2.62 2.62 0 113.707 3.707l-9.193 9.193-3.23.718a1 1 0 01-1.213-1.213l.718-3.23 9.193-9.193z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(address.addressBookId)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 3h6a2 2 0 012 2h3a1 1 0 110 2h-1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7H2a1 1 0 110-2h3a2 2 0 012-2zM9 7v10m6-10v10"
                    />
                  </svg>
                </button>

                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    checked={address.addressBookId === defaultAddressId}
                    onChange={() => handleSetDefault(address.addressBookId)}
                    className="hidden"
                  />
                  <span
                    className={`inline-block w-6 h-6 rounded-full border-2 ${
                      address.addressBookId === defaultAddressId
                        ? "bg-orange-400 border-orange-400"
                        : "border-gray-400"
                    } flex items-center justify-center`}
                  >
                    {address.addressBookId === defaultAddressId && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                </label>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-full mt-4">
            Không có địa chỉ nào để hiển thị.
          </p>
        )}
      </div>

      <div className="w-[180px] h-[50px] mt-4">
        <button
          type="button"
          className="bg-[#ffbb38] text-black px-4 py-2 rounded-md"
          onClick={handleAddNew}
        >
          <div className="w-full text-sm font-semibold">Thêm địa chỉ mới</div>
        </button>
      </div>

      {showModal && (
        <AddressModal
          showModal={showModal}
          setShowModal={setShowModal}
          addressData={selectedAddress}
          onSave={handleSaveAddress}
          userId={userInfo.id}
        />
      )}
    </>
  );
}
