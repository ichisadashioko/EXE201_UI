import { useState } from "react";
import Logo from "../components/common/Logo";
import { Link } from "react-router";
import Button from "../components/common/Button";
import Success from "./common/Success";
import { URL } from "../authentication";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(0);

  const handleSubmit = async () => {
    const response = await fetch(`${URL}/api/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setIsSuccess(1);
    } else {
      alert(data.message || "Signup failed");
    }
  };

  return (
    <section className="bg-home h-screen  flex flex-col gap-2 items-center justify-center ">
      {isSuccess === 0 && (
        <div className="p-5 w-full h-[70vh] flex flex-col justify-between ">
          <Logo />
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl text-[#343434] font-semibold">Đăng ký</h1>
            <div className="flex flex-col">
              <label htmlFor="email">Số điện thoại</label>
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
          <Button label="Xác nhận" onClick={handleSubmit} />
        </div>
      )}
      {isSuccess === 1 ? <Success redirect="/login" /> : <></>}
    </section>
  );
}
