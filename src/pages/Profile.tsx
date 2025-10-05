import { Link, useNavigate } from "react-router-dom";
import {
  KeyIcon,
  OutIcon,
  PaperIcon,
  UserIcon,
} from "../components/icon/Profile";
import { ChevronRight } from "lucide-react";
import {
  api_get_user_profile,
  getAccessToken,
  removeAccessToken,
} from "../authentication";
import { useEffect, useState } from "react";
import type { UserProfile } from "../types/user";

const Profile = () => {
  const navigate = useNavigate();
  const access_token = getAccessToken();
  const [user, setUser] = useState<UserProfile>();

  useEffect(() => {
    if (access_token === null) {
      navigate("/");
      return;
    }
    const fetchUserProfile = async () => {
      const response = await api_get_user_profile(access_token);
      setUser(response.data.user);
    };
    fetchUserProfile();
  }, [access_token, navigate]);

  const handleLogout = () => {
    removeAccessToken();
    navigate("/");
  };
  return (
    <div>
      <div className="relative inline-block h-[220px] ">
        <img
          src={`/assets/default/sky.svg`}
          //   alt={pet.name}
          className="w-full h-[220px] object-cover rounded-md"
        />
        <p className="absolute top-2 left-2 font-medium text-white text-2xl">
          Trang chủ
        </p>
        <img
          src={`/assets/default/cat.svg`}
          className=" absolute top-[65%] left-[30%] w-[150px] h-[150px] object-cover rounded-full"
        />
      </div>
      <div className="mt-[10vh] mb-3 text-center">
        <h3 className="text-2xl font-semibold">
          {user && user.name ? user.name : "User name"}
        </h3>
      </div>

      <div className="bg-white p-4 rounded-2xl ">
        <Link
          to={""}
          className="flex justify-between border-b border-neutral-500 py-3"
        >
          <p className="flex gap-2 items-center">
            <UserIcon /> Cá nhân
          </p>
          <p className="text-black font-medium">
            <ChevronRight />
          </p>
        </Link>
        <Link
          to={""}
          className="flex justify-between border-b border-neutral-500 py-3"
        >
          <p className="flex gap-2 items-center">
            <KeyIcon /> Đổi mật khẩu
          </p>
          <p className="text-black font-medium">
            <ChevronRight />
          </p>
        </Link>
        <Link
          to={""}
          className="flex justify-between border-b border-neutral-500 py-3"
        >
          <p className="flex gap-2 items-center">
            <PaperIcon /> Chính sách và điều khoản sử dụng
          </p>
          <p className="text-black font-medium">
            <ChevronRight />
          </p>
        </Link>
        <Link
          to={""}
          onClick={handleLogout}
          className="flex justify-between py-3"
        >
          <p className="flex gap-2 items-center">
            <OutIcon /> Đăng xuất
          </p>
          <p className="text-black font-medium">
            <ChevronRight />
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
