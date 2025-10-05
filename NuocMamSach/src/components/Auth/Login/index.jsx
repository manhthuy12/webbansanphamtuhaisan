import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InputCom from "../../Helpers/InputCom";
import Layout from "../../Partials/Layout";
import Thumbnail from "./Thumbnail";
import { Link, useNavigate } from "react-router-dom";
import { signIn, GetMe } from "../../../api/authApi"; // Import API login
import { message } from "antd"; // Import message từ Ant Design
import { loginUser } from "../../../redux/actions/userActions";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State để kiểm soát ẩn/hiện mật khẩu
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signIn(username, password);
      const token = response.token;
      localStorage.setItem("token", token);

      const userInfo = await GetMe(token);

      const userData = {
        token,
        ...userInfo,
      };

      dispatch(loginUser(userData));

      message.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      message.error("Đăng nhập không thành công! Vui lòng kiểm tra thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const rememberMe = () => {
    setValue(!checked);
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="lg:flex items-center relative">
            <div className="lg:w-[572px] w-full h-[783px] bg-white flex flex-col justify-center sm:p-10 p-5 border border-[#E0E0E0]">
              <div className="w-full">
                <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
                  <h1 className="text-[34px] font-bold leading-[74px] text-qblack">
                    Đăng Nhập
                  </h1>
                  <div className="shape -mt-6">
                    <svg
                      width="172"
                      height="29"
                      viewBox="0 0 172 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5.08742C17.6667 19.0972 30.5 31.1305 62.5 27.2693C110.617 21.4634 150 -10.09 171 5.08727"
                        stroke="#FFBB38"
                      />
                    </svg>
                  </div>
                </div>
                <div className="input-area">
                  <div className="input-item mb-5">
                    <InputCom
                      placeholder="Tên đăng nhập"
                      label="Tên đăng nhập*"
                      name="username"
                      type="text"
                      inputClasses="h-[50px]"
                      value={username}
                      inputHandler={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="input-item mb-5 relative">
                    <InputCom
                      placeholder="● ● ● ● ● ●"
                      label="Mật khẩu*"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      inputClasses="h-[50px]"
                      value={password}
                      inputHandler={(e) => setPassword(e.target.value)}
                    />
                    <div
                      className="absolute right-4 top-10 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="25"
                          height="21"
                          viewBox="0 0 25 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.5483 16.3524C20.156 15.9557 19.7696 15.5605 19.3802 15.1683C18.7802 14.5653 18.1787 13.9638 17.5728 13.3667C17.4972 13.2911 17.4871 13.2388 17.5379 13.1415C19.3482 9.66037 17.2125 5.46008 13.3332 4.87747C12.1143 4.69441 10.9534 4.89636 9.85791 5.46299C9.78672 5.49931 9.73587 5.53563 9.65596 5.45572C8.88157 4.67262 8.10136 3.89678 7.32261 3.11803C7.30082 3.09624 7.28338 3.07154 7.24561 3.0265C7.5667 2.90591 7.8689 2.78387 8.17837 2.67926C10.0758 2.03563 12.0242 1.83513 14.0132 2.05161C18.879 2.58337 23.1752 5.85381 24.9768 10.3926C25 10.4522 25.0073 10.5379 24.9826 10.596C24.0484 12.8916 22.5955 14.792 20.6282 16.2986C20.6137 16.3117 20.5963 16.3219 20.5483 16.3524Z"
                            fill="#797979"
                          />
                          <path
                            d="M4.44163 4.65918C4.91528 5.13573 5.3773 5.6021 5.84222 6.06703C6.36962 6.59442 6.89703 7.12327 7.42733 7.64776C7.49853 7.7175 7.51015 7.7669 7.4622 7.85989C5.81462 11.0228 7.40118 14.873 10.801 15.9336C12.2829 16.3956 13.7271 16.2576 15.1161 15.5573C15.1626 15.534 15.2076 15.5093 15.2468 15.489C16.0735 16.3186 16.893 17.1424 17.724 17.9778C17.6862 17.9952 17.6383 18.0199 17.5874 18.0403C15.5069 18.8844 13.3493 19.1909 11.1162 18.9657C6.18511 18.4674 1.87 15.2275 0.02773 10.6364C0.000124928 10.5666 -0.0114982 10.4693 0.0146539 10.4039C0.941602 8.12286 2.38433 6.23411 4.33557 4.73328C4.36317 4.71003 4.39514 4.69114 4.44163 4.65918Z"
                            fill="#797979"
                          />
                          <path
                            d="M2.04297 1.0577C2.36406 0.732254 2.72292 0.370486 3.09051 0C9.71717 6.64695 16.3482 13.2968 22.9749 19.9438C22.645 20.2721 22.2833 20.631 21.9128 21C15.2905 14.3531 8.66237 7.70174 2.04297 1.0577Z"
                            fill="#797979"
                          />
                          <path
                            d="M13.5471 13.7324C12.655 14.071 11.1164 14.0158 10.0093 12.8433C9.16664 11.9512 8.80197 10.3283 9.27125 9.46387C10.698 10.8877 12.116 12.3028 13.5471 13.7324Z"
                            fill="#797979"
                          />
                          <path
                            d="M11.519 7.24656C12.3123 6.80779 13.9425 7.17247 14.8389 8.01369C16.0172 9.11933 16.071 10.6638 15.7528 11.4933C14.342 10.0797 12.9269 8.66022 11.519 7.24656Z"
                            fill="#797979"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="forgot-password-area flex justify-between items-center mb-7">
                    <div className="remember-checkbox flex items-center space-x-2.5">
                      <button
                        onClick={rememberMe}
                        type="button"
                        className="w-5 h-5 text-qblack flex justify-center items-center border border-light-gray"
                      >
                        {checked && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <span
                        onClick={rememberMe}
                        className="text-base text-black"
                      >
                        Ghi nhớ tài khoản
                      </span>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-base text-qyellow"
                    >
                      Quên mật khẩu
                    </Link>
                  </div>
                  <div className="signin-area mb-3.5">
                    <div className="flex justify-center">
                      <button
                        onClick={handleLogin}
                        disabled={loading}
                        type="button"
                        className="black-btn mb-6 text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
                      >
                        {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                      </button>
                    </div>
                  </div>
                  <div className="signup-area flex justify-center">
                    <p className="text-base text-qgraytwo font-normal">
                      Chưa có tài khoản?
                      <Link to="/signup" className="ml-2 text-qblack">
                        Đăng ký miễn phí
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 lg:flex hidden transform scale-60 xl:scale-100 xl:justify-center">
              <div
                className="absolute xl:-right-20 -right-[138px]"
                style={{ top: "calc(50% - 258px)" }}
              >
                <Thumbnail />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
