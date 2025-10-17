import { useNavigate } from "react-router";
import { api_create_new_pet, getAccessToken } from "../../authentication";
import { useEffect, useState } from "react";

export default function NewPet() {
  const navigate = useNavigate();
  const access_token = getAccessToken();

  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (access_token == null) {
      console.log("Access token is null, redirecting to login page");
      navigate("/login");
    }
  }, [access_token, navigate]);

  const handleCreatePet = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const name = petName.trim();
    if (!name) {
      setError("Vui lòng nhập tên cho pet.");
      return;
    }

    if (!access_token) {
      setError("Bạn chưa đăng nhập. Chuyển tới trang đăng nhập...");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await api_create_new_pet(access_token, name);
      console.log("Create pet response:", response);

      if (response.success) {
        const pet_id = response.data?.pet?.id;
        if (pet_id) {
          // điều hướng đến trang pet vừa tạo
          navigate(`/pets/${pet_id}`);
        } else {
          console.error("Created but missing pet id:", response);
          setError("Đã tạo Pet nhưng không lấy được ID. Vui lòng kiểm tra console.");
        }
      } else {
        setError(`Tạo Pet thất bại: ${response.message || "Lỗi server"}`);
      }
    } catch (err) {
      console.error("Error creating pet:", err);
      setError("Đã xảy ra lỗi khi tạo Pet. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-2">Tạo Pet mới</h1>
      <p className="text-neutral-600 mb-4">Tạo hồ sơ cho thú cưng của bạn để quản lý thông tin và ảnh.</p>

      <form onSubmit={handleCreatePet} className="flex flex-col gap-4">
        <label htmlFor="input_pet_name" className="text-sm font-medium">Tên Pet</label>
        <input
          id="input_pet_name"
          type="text"
          placeholder="Nhập tên pet"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          className="border border-neutral-300 px-3 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#454699]"
          autoFocus
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            onClick={handleCreatePet}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-3xl text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#454699] hover:brightness-105"
              }`}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.2" strokeWidth="4" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span>Đang tạo...</span>
              </>
            ) : (
              <span>Tạo Pet</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-3xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
