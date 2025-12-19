import React, { useContext, useState } from "react";
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OTPInput from "otp-input-react";
import loginIcons from "../assest/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("emailPassword"); // 'phonePassword', 'phoneOtp', 'emailPassword'
  const [data, setData] = useState({
    login: "",
    otp: [], // Array to hold 6 OTP digits
    password: "",
  });

  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  // Handle input changes
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle OTP digit change
  // const handleOtpChange = (value, index) => {
  //   const newOtp = [...data.otp];
  //   newOtp[index] = value;
  //   setData((prev) => ({ ...prev, otp: newOtp }));

  //   // Move to the next input if the current one is filled
  //   if (value && index < 5) {
  //     document.getElementById(`otp-${index + 1}`).focus();
  //   }
  // };

  // Function to send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const otpResponse = await fetch(SummaryApi.sendOtp.url, {
        method: SummaryApi.sendOtp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: data.login }),
      });
      const otpResult = await otpResponse.json();
      console.log(otpResult);
      
      if (otpResult.success) {
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Function to verify OTP
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const otp = data?.otp; // Combine OTP digits into a single string
    try {
      const otpVerifyResponse = await fetch(SummaryApi.verifyOtp.url, {
        method: SummaryApi.verifyOtp.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: data.login, otp }),
      });
      const otpVerifyResult = await otpVerifyResponse.json();
      if (otpVerifyResult.success) {
        toast.success("Login successful!");
        await fetchUserDetails();
        await fetchUserAddToCart();
        navigate("/");
      } else {
        toast.error("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handlePhoneAndEmailWithPassword = async (e) => {
    e.preventDefault();

    try {
      const dataResponse = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        await fetchUserDetails(); // Fetch user details after login
        await fetchUserAddToCart(); // Fetch cart data after login
        // await handlePayment();
        navigate("/"); // Redirect to cart page after login
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleLoginMethodChange = (method) => {
    setLoginMethod(method);
    setData({
      login: "",
      otp: [], // Array to hold 6 OTP digits
      password: "",
    });
  };

  return (
    <section id="login">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto rounded-lg shadow-md">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login icons" />
          </div>

          {loginMethod === "phonePassword" && (
            <form
              className="pt-6 flex flex-col gap-4"
              onSubmit={handlePhoneAndEmailWithPassword}
            >
        <div>
            <label className="block text-sm font-medium mb-1">Phone Number:</label>
            <div className="flex items-center border rounded px-3 py-2 bg-slate-100 focus-within:border-red-600">
                <ReactPhoneInput
                    country="in"
                    value={data.login}
                    onChange={(phone) => handleOnChange({ target: { name: 'login', value: phone } })}
                    inputClass="flex-1 outline-none bg-transparent border-none"
                    buttonClass="bg-transparent border-none"
                    containerClass="flex w-full items-center"
                    dropdownClass="bg-white"
                    autoComplete='mobile'
                />
            </div>
        </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password:</label>
                <div className="bg-slate-100 p-2 flex border rounded focus-within:border-red-600">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={data.password}
                    name="password"
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent"
                    autoComplete='current-password'
                  />
                  <div
                    className="cursor-pointer text-xl"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <Link
                  to="/forgot-password"
                  className="block w-fit ml-auto hover:underline hover:text-red-600"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="onsubmit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
              >
                Login
              </button>

              <p className="my-2">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-700 hover:underline"
                >
                  Sign up
                </Link>
              </p>

              <p className="text-center mt-5">
                <span
                  className="text-red-600 hover:underline cursor-pointer"
                  onClick={() => handleLoginMethodChange("emailPassword")}
                >
                  Login with email?
                </span>
              </p>
            </form>
          )}

          {loginMethod === "phoneOtp" && (
            <form
              className="pt-6 flex flex-col gap-4"
              onSubmit={handleOtpVerify}
            >
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number:</label>
                <div className="flex items-center border rounded px-3 py-2 bg-slate-100 focus-within:border-red-600">
                  <ReactPhoneInput
                      country="in"
                      value={data.login}
                      onChange={(phone) => handleOnChange({ target: { name: 'login', value: phone } })}
                      inputClass="flex-1 outline-none bg-transparent border-none"
                      buttonClass="bg-transparent border-none"
                      containerClass="flex w-full items-center"
                      dropdownClass="bg-white"
                      autoComplete='mobile'
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-300 transform hover:scale-105"
              >
                Send OTP
              </button>

              {/* OTP Input Using otp-input-react */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">OTP:</label>
                <div className="flex items-center justify-center ml-4">
                <OTPInput
                  value={data.otp}
                  onChange={(otp) => handleOnChange({ target: { name: "otp", value: otp } })}
                  OTPLength={6} // Change to the required length of your OTP
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="flex justify-center "
                  inputClassName="w-8 h-8 xl:w-12 xl:h-12 text-center border rounded focus:outline-none focus:border-red-600"
                />
                </div>
              </div>

              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-300 transform hover:scale-105 mt-4">
                Verify OTP
              </button>

              <p className="my-2">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-700 hover:underline"
                >
                  Sign up
                </Link>
              </p>

              <p className="text-center mt-5">
                <span
                  className="text-red-600 hover:underline cursor-pointer"
                  onClick={() => handleLoginMethodChange("phonePassword")}
                >
                  Login with password?
                </span>
              </p>
            </form>
          )}

          {loginMethod === "emailPassword" && (
            <form
              className="pt-6 flex flex-col gap-2"
              onSubmit={handlePhoneAndEmailWithPassword}
            >
              <div className="grid">
                <label className="block text-sm font-medium mb-1">Email:</label>
                <div className="bg-slate-100 border rounded p-2 focus-within:border-red-600">
                  <input
                    type="email"
                    placeholder="Enter email"
                    name="login"
                    value={data.login}
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent"
                    autoComplete='email'
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password:</label>
                <div className="bg-slate-100 border rounded p-2 flex focus-within:border-red-600">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={data.password}
                    name="password"
                    onChange={handleOnChange}
                    className="w-full h-full outline-none bg-transparent "
                    autoComplete='current-password'
                  />
                  <div
                    className="cursor-pointer text-xl"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <Link
                  to="/forgot-password"
                  className="block w-fit ml-auto hover:underline hover:text-red-600"
                >
                  Forgot password?
                </Link>
              </div>

              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
                Login
              </button>

              <p className="my-2">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-700 hover:underline"
                >
                  Sign up
                </Link>
              </p>

              <p className="text-center mt-5">
                <span
                  className="text-red-600 hover:underline cursor-pointer"
                  onClick={() => handleLoginMethodChange("phonePassword")}
                >
                  Login with phone number?
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;
