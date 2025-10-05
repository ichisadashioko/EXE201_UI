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
  // const navigate = useNavigate();

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
                placeholder="Nhập số điện thoại"
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
          <div className="flex justify-between">
            <span className="border-b border-neutral-500 w-1/4 h-1/2"></span>
            <p className="text-neutral-500">Hoặc đăng nhập với</p>
            <span className="border-b border-neutral-500 w-1/4 h-1/2"></span>
          </div>
          <div className="text-center">
            <p>
              Bạn chưa có tài khoản?{" "}
              <span>
                <Link className="text-[#454699]" to={"/register"}>
                  <span className="underline">Đăng ký ngay</span>{" "}
                </Link>
              </span>
            </p>
          </div>
        </div>
      )}
      {isSuccess === 1 ? <Success redirect="/home" /> : <></>}
    </section>
  );
};

export default Login;
