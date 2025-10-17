import { useEffect, useState, useRef } from "react";
import {
  api_get_pet_info,
  api_upload_pet_image,
  getAccessToken,
  type api_get_pet_info_Pet,
  type api_get_pet_info_PetPicture,
  type api_upload_pet_image_OK,
} from "../../authentication";

import "./PetDetail.css";
import { Link, useNavigate, useParams } from "react-router";
import { ChevronLeft, Camera } from "lucide-react";
import { EditIcon } from "../../components/icon/EditIcon";
import PetGalleryHorizontalScroll from "../../components/common/PetGalleryHorizontalScroll";

export default function PetDetail() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const access_token = getAccessToken();

  const [image_list, setImageList] = useState<api_get_pet_info_PetPicture[]>([]);
  const [pet, setPet] = useState<api_get_pet_info_Pet | null>(null);

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Extracted upload handler: uploads file and updates UI state
  // Keeps the logic comment in English
  const handleUploadFile = async (file_obj: File) => {
    if (!access_token || !petId) {
      setUploadError("Bạn chưa đăng nhập hoặc ID pet không hợp lệ.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadProgress(null);

    try {
      // call API to upload image
      const retval = await api_upload_pet_image(access_token, petId, file_obj);

      console.debug("upload retval:", retval);

      if (retval.success) {
        const image_info = (retval.data as api_upload_pet_image_OK).image_info;
        // append to image list in UI
        setImageList((prev) => [...prev, image_info]);
        // also update pet.images so any parts of UI reading pet.images stay in sync
        setPet((prev) =>
          prev
            ? ({
                ...prev,
                images: [...(((prev as any).images as any[]) ?? []), image_info],
              } as api_get_pet_info_Pet)
            : prev
        );
        setUploadSuccess("Tải ảnh lên thành công.");
        // clear progress after a short delay
        setTimeout(() => setUploadSuccess(null), 2500);
      } else {
        setUploadError(`Tải ảnh thất bại: ${retval.message || "Lỗi server"}`);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setUploadError("Đã xảy ra lỗi khi tải ảnh. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  // Handler for input change; extracted for clarity
  const handleFileInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (!files || files.length === 0) return;
    const file_obj = files[0];
    // Basic client-side validation
    if (!["image/jpeg", "image/png"].includes(file_obj.type)) {
      setUploadError("Chỉ chấp nhận file JPG/PNG.");
      return;
    }
    if (file_obj.size > 10 * 1024 * 1024) {
      setUploadError("Kích thước file quá lớn (tối đa 10MB).");
      return;
    }
    handleUploadFile(file_obj);
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Trigger file input click
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (access_token == null) {
      console.log("Access token is null, redirecting to login page");
      navigate("/login");
      return;
    }

    if (petId == null) {
      console.error("petId is null, redirecting to home page");
      navigate("/home");
      return;
    }

    const fetchPetDetails = async () => {
      try {
        const retval = await api_get_pet_info(access_token, petId);

        console.debug(retval);

        if (retval.success) {
          try {
            let pet_info = retval.data as api_get_pet_info_Pet;
            setPet(pet_info);
            setImageList(pet_info.images);
          } catch (error) {
            console.error("Error parsing pet info:", error);
            setPet(null);
            alert(`Error fetching pet info: ${error}`);
          }
        } else {
          console.error("Failed to get pet info:", retval.message);
          alert(`Không lấy được thông tin pet: ${retval.message}`);
        }
      } catch (error) {
        console.error("Error fetching pet info:", error);
        alert("Đã xảy ra lỗi khi lấy thông tin pet. Vui lòng thử lại.");
      }
    };

    fetchPetDetails();
  }, [access_token, petId, navigate]);

  if (!pet) {
    return <div className="p-6">Không tìm thấy thông tin thú cưng.</div>;
  }

  return (
    <div id="pet_detail_root_container" className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link to={"/home"} className="flex gap-3 items-center text-neutral-700 hover:underline">
          <ChevronLeft />
          <p className="font-medium text-neutral-900 text-lg">Thông tin thú cưng</p>
        </Link>
        <button
          aria-label="Chỉnh sửa"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-neutral-200 hover:bg-neutral-50"
          onClick={() => navigate(`/pets/${pet.id}/edit`)}
        >
          <EditIcon />
          <span className="text-sm">Chỉnh sửa</span>
        </button>
      </div>

      <div className="mb-4">
        <PetGalleryHorizontalScroll images={pet.images} profile_picture_id={pet.profile_image_id} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#454699]">{pet.name}</h1>
          <p className="text-sm text-neutral-600">ID: {pet.id}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={openFileDialog}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-[#454699] text-white px-3 py-2 rounded-2xl hover:brightness-105 disabled:opacity-60"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm">{uploading ? "Đang tải..." : "Tải ảnh lên"}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl text-neutral-600 shadow-sm mb-4">
        {/* Pet attributes displayed dynamically */}
        {/*
          these fields may not be provided by backend yet;
          cast to any and compute display strings so TypeScript won't error.
        */}
        {(() => {
          const species = (pet as any)?.species ?? "Chưa cập nhật";
          const breed = (pet as any)?.breed ?? "Chưa cập nhật";
          const sex = (pet as any)?.sex ?? "Chưa cập nhật";
          const weightValue = (pet as any)?.weight;
          const weightDisplay = weightValue != null && weightValue !== "" ? `${weightValue} kg` : "Chưa cập nhật";
          return (
            <>
              <div className="flex justify-between border-b border-neutral-100 py-3">
                <p>Loài</p>
                <p className="text-black font-medium">{species}</p>
              </div>
              <div className="flex justify-between border-b border-neutral-100 py-3">
                <p>Giống</p>
                <p className="text-black font-medium">{breed}</p>
              </div>
              <div className="flex justify-between border-b border-neutral-100 py-3">
                <p>Giới tính</p>
                <p className="text-black font-medium">{sex}</p>
              </div>
              <div className="flex justify-between py-3">
                <p>Cân nặng</p>
                <p className="text-black font-medium">{weightDisplay}</p>
              </div>
            </>
          );
        })()}
      </div>

      {/* Upload status area */}
      <div className="mb-4">
        {uploadError && <div className="text-sm text-red-600 mb-2">{uploadError}</div>}
        {uploadSuccess && <div className="text-sm text-green-600 mb-2">{uploadSuccess}</div>}
        {uploadProgress != null && (
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden mb-2">
            <div className="h-2 bg-[#454699]" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
        <p className="text-xs text-neutral-500">Gợi ý: Chỉ JPG/PNG, tối đa 10MB. Ảnh sẽ hiển thị ngay sau khi tải lên.</p>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Ảnh đã tải lên</h2>
        {image_list.length === 0 ? (
          <div className="text-neutral-500">Chưa có ảnh nào. Hãy tải lên ảnh để làm phong phú hồ sơ.</div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {image_list.map((img) => (
              <div key={img.id} className="relative rounded-md overflow-hidden border border-neutral-100">
                <img src={img.url} alt={`Ảnh ${img.id}`} className="w-full h-28 object-cover" />
                {pet.profile_image_id === img.id && (
                  <div className="absolute top-1 left-1 bg-[#454699] text-white text-xs px-2 py-0.5 rounded">Ảnh đại diện</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
