import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputCom from "../../../Helpers/InputCom";
import { updateProfile } from "../../../../api/profileApi";
import { uploadToCloudinary } from "../../../../utils/uploadImage";
import { message } from "antd";
import { updateUser } from "../../../../redux/actions/userActions"; // Import updateUser từ Redux actions

export default function ProfileTab() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user); // Lấy thông tin user từ Redux

  const [profileImg, setProfileImg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Lưu file đã chọn
  const [userData, setUserData] = useState({
    id: 0,
    fullName: "",
    email: "",
    phoneNumber: "",
    // address: "",
  });
  const [loading, setLoading] = useState(false);
  const profileImgInput = useRef(null);

  useEffect(() => {
    // Lấy thông tin user từ Redux và set vào state
    if (userInfo) {
      setUserData({
        id: userInfo.profile.id,
        fullName: userInfo.profile.fullName || "",
        email: userInfo.profile.email || "",
        phoneNumber: userInfo.profile.phoneNumber || "",
        // address: userInfo.profile.address || "",
      });
      setProfileImg(userInfo.profile.avatar || null);
    }
  }, [userInfo]);

  const browseProfileImg = () => {
    profileImgInput.current.click();
  };

  const profileImgChangeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file); // Lưu file đã chọn
      const imgPreviewUrl = URL.createObjectURL(file); // Tạo URL để xem trước ảnh
      setProfileImg(imgPreviewUrl); // Hiển thị ảnh xem trước
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let avatarUrl = profileImg;

      // Nếu người dùng chọn ảnh mới thì upload lên Cloudinary
      if (selectedFile) {
        avatarUrl = await uploadToCloudinary(selectedFile); // Upload lên Cloudinary
      }

      const updatedData = {
        ...userData,
        avatar: avatarUrl, // Sử dụng URL của ảnh sau khi upload
      };

      // Gọi API để cập nhật thông tin user
      await updateProfile(updatedData.id, updatedData);

      // Cập nhật Redux store
      dispatch(updateUser(updatedData)); // Cập nhật thông tin user vào Redux
      message.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi cập nhật hồ sơ:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex space-x-8">
        <div className="w-[570px] ">
          <div className="input-item mb-8">
            <div className="w-full h-full">
              <InputCom
                label="Họ và tên*"
                placeholder="Họ và tên"
                type="text"
                name="fullName"
                value={userData.fullName}
                inputClasses="h-[50px]"
                inputHandler={handleInputChange}
              />
            </div>
          </div>
          <div className="input-item flex space-x-2.5 mb-8">
            <div className="w-1/2 h-full">
              <InputCom
                label="Email*"
                placeholder="demoemail@gmail.com"
                type="email"
                name="email"
                value={userData.email}
                inputClasses="h-[50px]"
                inputHandler={handleInputChange}
              />
            </div>
            <div className="w-1/2 h-full">
              <InputCom
                label="Số điện thoại*"
                placeholder="0123*******"
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                inputClasses="h-[50px]"
                inputHandler={handleInputChange}
              />
            </div>
          </div>
          {/* <div className="input-item mb-8">
            <div className="w-full">
              <InputCom
                label="Địa chỉ*"
                placeholder="Địa chỉ"
                type="text"
                name="address"
                value={userData.address}
                inputClasses="h-[50px]"
                inputHandler={handleInputChange}
              />
            </div>
          </div> */}
          <div className="action-area flex space-x-4 items-center">
        <button type="button" className="text-sm text-qred font-semibold">
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-[164px] h-[50px] bg-qblack text-white text-sm"
        >
          Cập nhật hồ sơ
        </button>
      </div>
        </div>
        <div className="flex-1">
          <div className="update-logo w-full mb-9">
            <h1 className="text-xl tracking-wide font-bold text-qblack flex items-center mb-2">
              Cập nhật hồ sơ
            </h1>
            <p className="text-sm text-qgraytwo mb-5 ">
              Ảnh hồ sơ kích thước tối thiểu 300x300. Hỗ trợ ảnh GIF, tối đa
              5mb.
            </p>
            <div className="flex xl:justify-center justify-start">
              <div className="relative">
                <div className="sm:w-[198px] sm:h-[198px] w-[199px] h-[199px] rounded-full overflow-hidden relative">
                  <img
                    src={
                      profileImg ||
                      `${
                        import.meta.env.VITE_PUBLIC_URL
                      }/assets/images/edit-profileimg.jpg`
                    }
                    alt="Ảnh đại diện"
                    className="object-cover w-full h-full"
                  />
                </div>
                <input
                  ref={profileImgInput}
                  onChange={profileImgChangeHandler}
                  type="file"
                  className="hidden"
                />
                <div
                  onClick={browseProfileImg}
                  className="w-[32px] h-[32px] absolute bottom-7 sm:right-0 right-[105px] bg-qblack rounded-full cursor-pointer"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.5147 11.5C17.7284 12.7137 18.9234 13.9087 20.1296 15.115C19.9798 15.2611 19.8187 15.4109 19.6651 15.5683C17.4699 17.7635 15.271 19.9587 13.0758 22.1539C12.9334 22.2962 12.7948 22.4386 12.6524 22.5735C12.6187 22.6034 12.5663 22.6296 12.5213 22.6296C11.3788 22.6334 10.2362 22.6297 9.09365 22.6334C9.01498 22.6334 9 22.6034 9 22.536C9 21.4009 9 20.2621 9.00375 19.1271C9.00375 19.0746 9.02997 19.0109 9.06368 18.9772C10.4123 17.6249 11.7609 16.2763 13.1095 14.9277C14.2295 13.8076 15.3459 12.6913 16.466 11.5712C16.4884 11.5487 16.4997 11.5187 16.5147 11.5Z"
                      fill="white"
                    />
                    <path
                      d="M20.9499 14.2904C19.7436 13.0842 18.5449 11.8854 17.3499 10.6904C17.5634 10.4694 17.7844 10.2446 18.0054 10.0199C18.2639 9.76139 18.5261 9.50291 18.7884 9.24443C19.118 8.91852 19.5713 8.91852 19.8972 9.24443C20.7251 10.0611 21.5492 10.8815 22.3771 11.6981C22.6993 12.0165 22.7105 12.4698 22.3996 12.792C21.9238 13.2865 21.4443 13.7772 20.9686 14.2717C20.9648 14.2792 20.9536 14.2867 20.9499 14.2904Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
