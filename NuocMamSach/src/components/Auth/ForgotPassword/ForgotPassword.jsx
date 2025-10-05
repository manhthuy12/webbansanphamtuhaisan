import { useEffect, useState } from "react";
import { message } from "antd";
import InputCom from "../../Helpers/InputCom";
import Layout from "../../Partials/Layout";
import { sendResetPasswordEmail } from "../../../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const code  = await sendResetPasswordEmail(email);
      console.log(code)
      message.success("Email đặt lại mật khẩu đã được gửi thành công!");
    } catch (error) {
      message.error("Gửi email không thành công. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="forgot-password-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="lg:w-[572px] w-full mx-auto bg-white flex flex-col justify-center p-10 border border-[#E0E0E0]">
            <div className="text-center mb-7">
              <h1 className="text-[34px] font-bold text-qblack">Quên Mật Khẩu</h1>
              <p className="text-qgraytwo mt-2">Nhập email của bạn để nhận link đặt lại mật khẩu</p>
            </div>
            <div className="input-area mb-5">
              <InputCom
                placeholder="Nhập email của bạn"
                label="Email*"
                name="email"
                type="email"
                inputClasses="h-[50px]"
                value={email}
                inputHandler={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                type="button"
                className="black-btn text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
              >
                {loading ? "Đang gửi..." : "Gửi Email Đặt Lại Mật Khẩu"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
