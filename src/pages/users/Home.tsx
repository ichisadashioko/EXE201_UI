import { useEffect, useState } from "react";
import {
  api_get_user_profile,
  api_get_matches,
  getAccessToken,
  api_update_display_name,
} from "../../authentication";
// import { useNavigate } from "react-router";
import UsersMatchListView from "../../pages/matching/UsersMatchListView";
import { Link, useNavigate } from "react-router-dom";
import type { Pet } from "../../types/pets";
import type { UserProfile } from "../../types/user";
import PetsList from "../pets/PetsList";
import { Container } from "react-bootstrap";
import { PlusIcon } from "../../components/icon/PlusIcon";

// Define the interface for a single Pet

// .Select(obj => new
// {
//     id = obj.Id,
//     is_guest = obj.IsGuest,
//     created_at = obj.CreatedAt,
//     pets = obj.Pets.Select(pet => new
//     {
//         id = pet.PetId,
//         name = pet.Name,
//         description = pet.Description,
//         profile_image_id = pet.ProfilePictureId,
//         profile_image_url = ((pet.ProfilePicture == null) ? null : pet.ProfilePicture.Url),
//         //species = pet.Species,
//         //breed = pet.Breed,
//         //age = pet.Age,
//         //bio = pet.Bio,
//         created_at = pet.CreatedAt,
//     }).ToList(),
// })

export default function Home() {
  // TODO fetch user profile and display user name
  // const [user, setUser] =
  // let [tmp_user_profile_json_obj, set_tmp_user_profile_json_obj] = useState<any>(null);

  const [user_profile, set_user_profile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const access_token = getAccessToken();
  const [matches, set_matches] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState("");

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
            .user as UserProfile;
          set_user_profile(user_profile_data);
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

      try {
        const matches_response = await api_get_matches(access_token);
        console.debug(matches_response);
        if (matches_response.success) {
          // Handle matches data if needed
          set_matches(matches_response.data.matches);
        } else {
          console.error("Failed to fetch matches:", matches_response.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    load_data();
  }, [access_token, navigate]); // Add dependencies to prevent potential stale closures

  const handleSaveName = async () => {
    if (!access_token || !user_profile) return;
    try {
      const response = await api_update_display_name(access_token, displayName);
      if (response.success) {
        set_user_profile({ ...user_profile, name: displayName });
        setIsEditingName(false);
      } else {
        alert(`Failed to update name: ${response.message}`);
      }
    } catch (error) {
      console.error("Error updating name:", error);
      alert("An error occurred while updating your name.");
    }
  };
  // Show a loading message while the user profile is being fetched
  if (!user_profile) {
    return <div>Loading your profile...</div>;
  }

  return (
    <section className="flex flex-col gap-5">
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
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="bg-white py-3 px-2 border border-[#454699] w-full rounded-3xl"
        />
      </div>

      <div className="flex justify-between">
        <p className="font-medium text-neutral-950 text-xl">Pet của tôi</p>
        <Link to={"/pets/create"}>
          <PlusIcon />
        </Link>
      </div>
      <div>
        <PetsList pets={user_profile.pets} />
      </div>

      {user_profile ? (
        <div id="match_list_container">
          <UsersMatchListView
            me={{
              id: user_profile.id,
              name: user_profile.name || null,
            }}
            matches={matches}
          />
        </div>
      ) : null}
    </section>
  );
}
