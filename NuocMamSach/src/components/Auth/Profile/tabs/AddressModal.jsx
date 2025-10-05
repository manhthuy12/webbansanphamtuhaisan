import React, { useState, useEffect } from "react";
import { Form, Input, Select, message } from "antd";
import { motion } from "framer-motion";
import {
  fetchProvinces,
  fetchDistrictsByProvince,
  fetchWardsByDistrict,
  createAddressBook,
  updateAddressBook,
} from "../../../../api/addressBookApi";

const { Option } = Select;

const AddressModal = ({
  showModal,
  setShowModal,
  addressData,
  onSave,
  userId,
}) => {
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      const data = await fetchProvinces();
      setCities(data);
    };
    loadCities();

    if (addressData) {
      // Set giá trị của form và load các quận/huyện/phường khi chỉnh sửa
      form.setFieldsValue(addressData);
      if (addressData.city) {
        fetchDistrictsFromAPI(addressData.city);
      }
      if (addressData.district) {
        fetchWardsFromAPI(addressData.district);
      }
    } else {
      form.resetFields();
    }
  }, [addressData]);

  const fetchDistrictsFromAPI = async (provinceCode) => {
    if (!provinceCode) return;
    const data = await fetchDistrictsByProvince(provinceCode);
    setDistricts(data);
  };

  const fetchWardsFromAPI = async (districtCode) => {
    if (!districtCode) return;
    const data = await fetchWardsByDistrict(districtCode);
    setWards(data);
  };

  const handleProvinceChange = (value, key) => {
    setSelectedProvince(value);
    setDistricts([]);
    setWards([]);
    fetchDistrictsFromAPI(key);
    form.setFieldsValue({ district: undefined, ward: undefined });
  };

  const handleDistrictChange = (value, key) => {
    setSelectedDistrict(value);
    setWards([]);
    fetchWardsFromAPI(key);
    form.setFieldsValue({ ward: undefined });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      const addressPayload = {
        ...values,
        city: selectedProvince || values.city,
        district: selectedDistrict || values.district,
      };

      if (addressData) {
        await updateAddressBook(
          addressData.addressBookId,
          addressPayload.recipientName,
          addressPayload.phoneNumber,
          addressPayload.address,
          addressPayload.ward,
          addressPayload.district,
          addressPayload.city,
        );
        message.success("Cập nhật địa chỉ thành công!");
      } else {
        await createAddressBook(
          userId,
          addressPayload.recipientName,
          addressPayload.phoneNumber,
          addressPayload.address,
          addressPayload.ward,
          addressPayload.district,
          addressPayload.city,
        );
        message.success("Tạo mới địa chỉ thành công!");
      }

      onSave(addressPayload);
      setShowModal(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xử lý địa chỉ");
    } finally {
      setIsLoading(false);
    }
  };

  return showModal ? (
    <motion.div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg h-3/4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          {addressData ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        </h2>
        <Form form={form} layout="vertical">
          <Form.Item
            name="recipientName"
            label="Tên người nhận"
            rules={[
              { required: true, message: "Vui lòng nhập tên người nhận!" },
            ]}
          >
            <Input placeholder="Tên người nhận" style={{ height: "50px" }} />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Số điện thoại" style={{ height: "50px" }} />
          </Form.Item>

          {/* <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập email hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Email" style={{ height: "50px" }} />
          </Form.Item> */}

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Địa chỉ" style={{ height: "50px" }} />
          </Form.Item>

          <Form.Item
            name="city"
            label="Tỉnh/Thành phố"
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh/thành phố!" },
            ]}
          >
            <Select
              placeholder="Chọn Tỉnh/Thành phố"
              onChange={(value, option) => handleProvinceChange(value, option.key)} 
              style={{ height: "50px" }}
            >
              {cities.map((city) => (
                <Option key={city.code} value={city.name}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
          >
            <Select
              placeholder="Chọn Quận/Huyện"
              onChange={(value, option) => handleDistrictChange(value, option.key)} 
              disabled={!selectedProvince}
              style={{ height: "50px" }}
            >
              {districts.map((district) => (
                <Option key={district.code} value={district.name}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ward"
            label="Phường/Xã"
            rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
          >
            <Select
              placeholder="Chọn Phường/Xã"
              disabled={!selectedDistrict}
              style={{ height: "50px" }}
            >
              {wards.map((ward) => (
                <Option key={ward.code} value={ward.name}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <div className="flex justify-end mt-6 space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={() => setShowModal(false)}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSave}
            disabled={isLoading}
          >
            {addressData ? "Lưu" : "Tạo mới"}
          </button>
        </div>
      </div>
    </motion.div>
  ) : null;
};

export default AddressModal;
