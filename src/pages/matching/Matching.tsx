import {
  api_matching_record_store_rating,
  api_pets_matching,
  getAccessToken,
} from "../../authentication";
import { useEffect, useState } from "react";
import type { MatchingPetInfo } from "../../typing";
import SampleOwnImageSelector from "../users/SampleOwnImageSelector";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import StarIcon from "../../components/icon/StarIcon";
import RedHeartIcon from "../../components/icon/RedHeartIcon";
import { CrossIcon } from "../../components/icon/CrossIcon";

function SwipeCard({
  profile,
  onSwipe,
}: {
  profile: MatchingPetInfo;
  onSwipe: (direction: "left" | "right") => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX - startX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(currentX) > 100) {
      onSwipe(currentX > 0 ? "right" : "left");
    }
    setCurrentX(0);
  };

  const rotation = currentX * 0.1;
  const opacity = 1 - Math.abs(currentX) / 300;

  return (
    <div
      className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: `translateX(${currentX}px) rotate(${rotation}deg)`,
        opacity: isDragging ? opacity : 1,
        transition: isDragging ? "none" : "all 0.3s ease",
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Image Section */}
      <div className="relative h-full">
        <img
          src={`/assets/default/cat.svg`}
          alt={profile.name}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Swipe Indicators */}
        {isDragging && (
          <>
            <div
              className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-lg"
              style={{ opacity: currentX > 0 ? currentX / 100 : 0 }}
            >
              ❤️ LIKE
            </div>
            <div
              className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-lg"
              style={{ opacity: currentX < 0 ? Math.abs(currentX) / 100 : 0 }}
            >
              ❌ PASS
            </div>
          </>
        )}

        {/* Basic Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#000148]/70 via-[#000148]/30 to-transparent p-5 text-white">
          <div className="flex justify-between items-baseline">
            <h2 className="text-3xl font-bold">{profile.name}</h2>
            <p>1kg</p>
          </div>
          <div className="flex justify-between items-baseline">
            <p className="flex items-center">
              <MapPin height={"17px"} /> Distance info
            </p>
            <p>1.5 year</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      {/* <div className="absolute bottom-2">
        <div>
          <div>
            <h3>About {profile.name}</h3>
            <p className="text-gray-600">{profile.description}</p>
          </div>

          {isExpanded && (
            <div className="space-y-2 text-gray-600">
              <p>🎯 Looking for something serious</p>
              <p>🎵 Loves indie music</p>
              <p>🍕 Foodie at heart</p>
              <p>✈️ Travel enthusiast</p>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 underline"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        </div>
      </div> */}
    </div>
  );
}

export function OffspringGeneratorModal({
  parentA,
  onClose,
}: {
  parentA: MatchingPetInfo;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  // const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const imageAUrl = parentA.profile_image_url;
  // const [imageAUrl, setImageAUrl] = useState(parentA.profile_image_url || '');
  const [imageBUrl, setImageBUrl] = useState("");

  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const access_token = getAccessToken();

  const [show_popup_image_selector, set_show_popup_image_selector] =
    useState(false);

  const handleGenerate = async () => {
    if (!imageAUrl || !imageBUrl) {
      alert("Please provide both image URLs.");
      return;
    }
    if (access_token == null) {
      alert("Access token is null, please log in again.");
      return;
    }

    setIsLoading(true);
    setResultImageUrl(null);

    try {
      const response = await fetch("/api/ai/offspring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          image_a_url: imageAUrl,
          image_b_url: imageBUrl,
        }),
      });

      const data = await response.json();
      console.debug(data);
      if (response.ok) {
        setResultImageUrl(data.image_url);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error generating offspring image:", error);
      alert("An error occurred while generating the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-2xl mb-4">Generate Offspring for {parentA.name}</h2>

        {/* Show image A and image B side by side */}
        <div className="flex justify-center items-center gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className="mb-2 text-gray-700">Image A</span>
            <img
              src={imageAUrl ?? undefined}
              alt="Parent A"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-2 text-gray-700">Image B</span>
            <img
              src={imageBUrl ?? undefined} // TODO show placeholder component if null
              alt="Parent B"
              className="w-32 h-32 object-cover rounded border cursor-pointer"
              onClick={() => set_show_popup_image_selector(true)}
            />
            <button
              className="mt-2 text-blue-500 underline"
              onClick={() => set_show_popup_image_selector(true)}
            >
              {imageBUrl ? "Change" : "Select"} Image B
            </button>
          </div>
        </div>

        {/* Popup image selector */}
        {show_popup_image_selector && (
          <SampleOwnImageSelector
            other_image_hash={null} // TODO pass other user's image hash
            onSelect={(url) => {
              setImageBUrl(url);
              set_show_popup_image_selector(false);
            }}
            onClose={() => set_show_popup_image_selector(false)}
          />
        )}

        <div className="space-y-4">
          <button
            onClick={handleGenerate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Offspring"}
          </button>

          {resultImageUrl && (
            <div className="mt-4">
              <h3 className="text-xl mb-2">Resulting Offspring Image:</h3>
              <img
                src={resultImageUrl}
                alt="Offspring"
                className="w-full rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Matching() {
  const navigate = useNavigate();
  const access_token = getAccessToken();
  const [pet_info_list, setPetInfoList] = useState<MatchingPetInfo[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [showOffspringModal, setShowOffspringModal] = useState(false);
  const [currentPetForOffspring, setCurrentPetForOffspring] =
    useState<MatchingPetInfo | null>(null);

  // Handler for swipe actions
  const handleSwipe = async (direction: "left" | "right") => {
    const profile = pet_info_list[currentIndex];
    console.log(`Swiped ${direction} on pet:`, profile);
    // TODO implement undo feature

    if (access_token == null) {
      console.error("Access token is null, cannot store matching record");
      navigate("/login");
      return;
    }

    if (profile == null) {
      console.error("Profile is null, cannot store matching record");
      return;
    }

    // TODO call API
    api_matching_record_store_rating(
      access_token!,
      profile.id,
      direction === "left" ? -1 : 1
    )
      .then((retval) => {
        console.debug(retval);
        if (retval.success) {
          console.log("Stored matching record successfully");
        } else {
          alert(`Failed to store matching record: ${retval.message}`);
        }
      })
      .catch((error) => {
        console.error("Error storing matching record:");
        console.error(error);
        alert(`Error storing matching record: ${error}`);
      });

    setCurrentIndex((prev) => prev + 1);
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    handleSwipe(direction);
  };

  const handleOpenOffsprintModel = () => {
    // get current profile
    const profile = pet_info_list[currentIndex];
    if (profile == null) {
      console.error("Profile is null, cannot open Offsprint model");
      return;
    }

    setCurrentPetForOffspring(profile);
    setShowOffspringModal(true);
  };

  useEffect(() => {
    if (access_token == null) {
      console.log("Access token is null, redirecting to login page");
      navigate("/login");
      return;
    }

    async function fetchMatchingPets() {
      const retval = await api_pets_matching(access_token!);

      console.debug(retval);

      if (retval.success) {
        try {
          const pet_list = retval.data.pets;
          setPetInfoList(pet_list);
          console.log("Fetched matching pets:", pet_list);
        } catch (error) {
          console.error("Error fetching matching pets:");
          console.error(error);
          alert(`Error fetching matching pets: ${error}`);
          return;
        }
        // alert("Image uploaded successfully");
      } else {
        alert(`Failed to fetch matching pets: ${retval.message}`);
      }
    }

    fetchMatchingPets();
  }, [access_token, navigate]);

  if (currentIndex >= pet_info_list.length) {
    // TODO call API to get more pets
    // return <div>No more pets to show</div>;
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1>No more profiles!</h1>
          <p className="text-gray-600">Check back later for more matches.</p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Reset Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    // <div>
    //     <h1>Matching</h1>
    //     <pre>{JSON.stringify(pet_info_list, null, 4)}</pre>
    // </div>

    <div className="min-h-screen bg-gray-50 p-4">
      {/* Offspring Modal */}
      {showOffspringModal && currentPetForOffspring && (
        <OffspringGeneratorModal
          parentA={currentPetForOffspring}
          onClose={() => setShowOffspringModal(false)}
        />
      )}
      <div className="mb-6">
        <p className="font-medium text-neutral-950 text-2xl">Hồ sơ thú cưng</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-md h-[60vh] mb-8">
          {/* Stack Effect - Show next cards behind */}
          {pet_info_list
            .slice(currentIndex, currentIndex + 3)
            .map((profile, index) => (
              <div
                key={profile.id}
                className="absolute inset-0"
                style={{
                  zIndex: 3 - index,
                  transform: `scale(${1 - index * 0.05}) translateY(${
                    index * 8
                  }px)`,
                  opacity: 1 - index * 0.3,
                }}
              >
                {index === 0 ? (
                  <SwipeCard profile={profile} onSwipe={handleSwipe} />
                ) : (
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img
                      src={profile.profile_image_url ?? undefined}
                      alt={profile.profile_image_url ?? "No Image"}
                      className="w-full h-3/5 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{profile.name}</h3>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 mb-4">
        <button
          onClick={() => handleButtonSwipe("left")}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all"
        >
          <CrossIcon />
        </button>
        <button
          onClick={() => handleOpenOffsprintModel()}
          className="p-5 bg-[#FFBF38] rounded-full shadow-lg flex items-center justify-center text-2xl transition-all"
        >
          <StarIcon />
        </button>
        <button
          onClick={() => handleButtonSwipe("right")}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all"
        >
          <RedHeartIcon />
        </button>
      </div>

      <div className="text-center mt-4 text-gray-600">
        <p>Swipe or drag cards left/right</p>
      </div>
    </div>
  );
}
