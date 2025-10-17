import { useState } from "react";
import api from "../authentication";
import Logo from "../components/common/Logo";
import Button from "../components/common/Button";
import { Link } from "react-router";
import Success from "./common/Success";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(0);
  const [verificationEmail, setVerificationEmail] = useState("");
  // const navigate = useNavigate();

  const handleResendVerification = async () => {
    try {
      // Replace with the actual function name in your api module, e.g. api.resendVerification or api.api_resend_verification
      const resp = await api.api_resend_verification(verificationEmail);
      if (resp && resp.success) {
        alert("Verification email resent. Please check your inbox.");
      } else {
        alert(`Could not resend verification: ${resp?.message || resp?.status_code || "unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error resending verification email.");
    }
  };

  const handleSubmit = async () => {
    // event.preventDefault();

    api
      .api_login_with_email(email, password)
      .then((retval) => {
        console.debug(retval);
        if (retval.success) {
          const access_token = retval.data.access_token;
          if (access_token == null) {
            alert("Login failed: Internal Server Error: access_token is null");
            return;
          }

          api.storeAccessToken(access_token);
          console.debug("Access Token:", access_token);
          setIsSuccess(1);
        } else {
          if (retval.status_code === 401) {
            if (retval.data != null) {
              if (retval.data.ui_code === 'VERIFICATION_REQUIRED') {
                // show verify-email UI
                setVerificationEmail(email);
                setIsSuccess(2);
                return;
              }
            }
          }

          const error_message = `Login failed: ${retval.status_code} ${retval.message} - ${retval.data}`;
          console.error(error_message);
          alert(error_message);
        }
      })
      .catch((error) => {
        console.error("Error during login:");
        console.error(error);
        alert(`Login failed: ${error}`);
        // alert(`Login failed: ${retval.message}`);
        // console.error("Error storing matching record:");
        // console.error(error);
        // alert(`Error storing matching record: ${error}`);
      });

    //----------------------------------------------------------
    // const response = await fetch("/api/users/login_with_email", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password }),
    // });

    // if (response.ok) {
    //     const data = await response.json();
    //     if (data == null) {
    //         alert("Login failed: Internal Server Error: response data is null");
    //         return;
    //     }
    //     const access_token = data.access_token;
    //     if (access_token == null) {
    //         alert("Login failed: Internal Server Error: access_token is null");
    //         return;
    //     }
    // api.storeAccessToken(access_token);
    // alert("Login successful!");
    // console.log("Access Token:", data.access_token);
    // TODO how to redirect to home page?
    // navigate("/home");
    // } else {
    //         const response_text = await response.text();
    //     const error_message = `Login failed: ${response.status} ${response.statusText} - ${response_text}`;
    //     console.error(error_message);
    //     alert(error_message);
    //     // alert(data.message || "Login failed");
    // }
  };

  return (
    <section className="bg-home h-screen  flex flex-col gap-2 items-center justify-center ">
      {isSuccess === 0 && (
        <div className="p-5 w-full h-[70vh] flex flex-col justify-between ">
          <Logo />
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl text-[#343434] font-semibold">Đăng nhập</h1>
            <div className="flex flex-col">
              <label htmlFor="email">Tài khoản</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Nhập email"
                onChange={(e) => setEmail(e.target.value)}
                className="border border-neutral-500 px-3 py-2 rounded-3xl bg-white"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Nhập mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
                className="border border-neutral-500 px-3 py-2 rounded-3xl bg-white"
                required
              />
            </div>
          </div>
          <div className="text-right">
            <Link to={"/login"} className="text-[#454699]">
              <span className="underline">Quên mật khẩu?</span>
            </Link>
          </div>
          <Button label="Đăng nhập" onClick={handleSubmit} />
          {/* <div className="flex justify-between">
            <span className="border-b border-neutral-500 w-1/4 h-1/2"></span>
            <p className="text-neutral-500">Hoặc đăng nhập với</p>
            <span className="border-b border-neutral-500 w-1/4 h-1/2"></span>
          </div> */}
          <div className="text-center">
            <p>
              Bạn chưa có tài khoản?{" "}
              <span>
                <Link className="text-[#454699]" to={"/signup"}>
                  <span className="underline">Đăng ký ngay</span>{" "}
                </Link>
              </span>
            </p>
          </div>
        </div>
      )}

      {isSuccess === 2 && (
        <div className="p-5 w-full h-[70vh] flex flex-col justify-center items-center gap-4">
          <Logo />
          <h2 className="text-xl font-semibold">Xác minh email</h2>
          <p className="text-center">
            Một liên kết xác thực đã được gửi tới <strong>{verificationEmail}</strong>. Vui lòng kiểm tra hộp thư đến (và spam).
          </p>
          <div className="flex gap-3">
            <Button label="Đã xác minh — Tiếp tục" onClick={() => {
              // TODO reload login page
              // replace hard reload with a soft reset so UI shows the login form again
              setIsSuccess(0);
              setPassword("");
            }} />
            <Button label="Gửi lại email xác minh" onClick={handleResendVerification} />
          </div>
          <p className="text-sm text-neutral-500">Nếu bạn không nhận được email, kiểm tra thư rác hoặc liên hệ với bộ phận hỗ trợ.</p>
        </div>
      )}

      {isSuccess === 1 ? (
        <Success redirect="/home" text="Đăng nhập thành công" />
      ) : (
        <></>
      )}
    </section>
  );
};

export default Login;
