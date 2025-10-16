import { useEffect, useState } from "react";
import {
  api_get_user_profile,
  // api_get_matches,
  getAccessToken,
  type api_get_user_profile_Pet,
  type api_get_user_profile_UserProfile,
  // api_update_display_name,
} from "../../authentication";
// import { useNavigate } from "react-router";
import { Link, useNavigate } from "react-router";
import { PlusIcon } from "../../components/icon/PlusIcon";
import { Search } from "lucide-react";
import { NextICon } from "../../components/icon/NextICon";

const PetsCard = ({ pet }: { pet: api_get_user_profile_Pet }) => {
  return (
    <Link to={`/pets/${pet.id}`} className="relative inline-block h-[220px] ">
      <img
        src={
          pet.profile_image_url
            ? pet.profile_image_url
            : `/assets/default/cat.svg`
        }
        alt={pet.name}
        className="w-[50vw] h-[220px] object-cover rounded-md"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-t from-[#000148]/70 via-[#000148]/30 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-2  text-white px-2 py-1 flex w-full justify-between align-middle items-center">
        <div>
          <p className="text-xl">{pet.name}</p>
        </div>
        <Link to={`/pets/${pet.id}`}>
          <NextICon />
        </Link>
      </div>
    </Link>
  );
};

function PetList({ pets }: { pets: api_get_user_profile_Pet[] }) {
  if (pets.length === 0) {
    return (
      <div>
        <h2>Your Pets</h2>
        <p>You haven't created any pets yet.</p>
      </div>
    );
  }

  return (
    <div className="grid h-[68vh] overflow-auto grid-cols-2 gap-4">
      {pets.map((pet) => (
        <PetsCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
};

export default function Home() {
  // TODO fetch user profile and display user name
  // const [user, setUser] =
  // let [tmp_user_profile_json_obj, set_tmp_user_profile_json_obj] = useState<any>(null);

  const [user_profile, set_user_profile] = useState<api_get_user_profile_UserProfile | null>(null);
  const navigate = useNavigate();
  const access_token = getAccessToken();
  // const [isEditingName, setIsEditingName] = useState(false);
  // const [displayName, setDisplayName] = useState("");
  const [searchPet, setSearchPet] = useState("");
  const [searchPetList, setSearchPetList] = useState<api_get_user_profile_Pet[]>([]);

  useEffect(() => {
    if (access_token === null) {
      navigate("/");
      return; // Return early
    }

    const load_data = async () => {
      try {
        const user_profile_response = await api_get_user_profile(access_token);
        console.debug(user_profile_response);
        if (user_profile_response.success) {
          // Assuming the API response structure is { success: true, data: { user: { ... } } }
          const user_profile_data = user_profile_response.data
            .user as api_get_user_profile_UserProfile;
          set_user_profile(user_profile_data);
          setSearchPetList(user_profile_data.pets);
        } else {
          console.error(
            "Failed to fetch user profile:",
            user_profile_response.message
          );
          alert(
            `Failed to fetch user profile: ${user_profile_response.message}`
          );
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("An error occurred while fetching user profile:", error);
        alert("An error occurred. Please try logging in again.");
        navigate("/login");
        return;
      }
    };

    load_data();
  }, [access_token, navigate]); // Add dependencies to prevent potential stale closures

  useEffect(() => {
    if (!user_profile?.pets) return;

    if (searchPet) {
      const filtered = user_profile.pets.filter((pet) =>
        pet.name.toUpperCase().includes(searchPet.toUpperCase())
      );
      setSearchPetList(filtered);
    } else {
      setSearchPetList(user_profile.pets);
    }
  }, [searchPet, user_profile?.pets]);

  // const handleSaveName = async () => {
  //   if (!access_token || !user_profile) return;
  //   try {
  //     const response = await api_update_display_name(access_token, displayName);
  //     if (response.success) {
  //       set_user_profile({ ...user_profile, name: displayName });
  //       setIsEditingName(false);
  //     } else {
  //       alert(`Failed to update name: ${response.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Error updating name:", error);
  //     alert("An error occurred while updating your name.");
  //   }
  // };

  // Show a loading message while the user profile is being fetched
  if (!user_profile) {
    return <div>Loading your profile...</div>;
  }

  return (
    <section className="flex flex-col h-full gap-5 justify-between">
      {/* {isEditingName ? (
        <div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoFocus
          />
          <button onClick={handleSaveName}>Save</button>
          <button
            onClick={() => {
              setIsEditingName(false);
              setDisplayName(user_profile.name || "");
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <h1
          onClick={() => setIsEditingName(true)}
          style={{ cursor: "pointer" }}
        >
          Welcome, {user_profile.name || `User #${user_profile.id}`}
          <span
            style={{ fontSize: "0.6em", marginLeft: "10px", color: "gray" }}
          >
            {" "}
            (edit)
          </span>
        </h1>
      )} */}
      <div>
        <p className="font-medium text-neutral-950 text-2xl">Trang chủ</p>
      </div>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchPet}
          onChange={(e) => setSearchPet(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-[#454699] rounded-3xl focus:ring-2 focus:ring-[#454699] focus:outline-none"
        />
      </div>

      <div className="flex justify-between">
        <p className="font-medium text-neutral-950 text-xl">Pet của tôi</p>
        <Link to={"/pets/create"}>
          <PlusIcon />
        </Link>
      </div>
      <div>
        <PetList pets={searchPetList} />
      </div>
    </section>
  );
}
