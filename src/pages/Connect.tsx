import { useEffect, useState } from "react";
import {
  api_get_matches,
  api_get_user_profile,
  getAccessToken,
} from "../authentication";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import type { UserProfile } from "../types/user";
import UsersMatchListView from "./matching/UsersMatchListView";

const Connect = () => {
  const [matches, set_matches] = useState([]);
  const access_token = getAccessToken();
  const [user_profile, set_user_profile] = useState<UserProfile | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (access_token === null) {
      navigate("/");
      return; // Return early
    }
    const fetchData = async () => {
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
    fetchData();
  }, [access_token, navigate]);

  console.log({ matches });

  return (
    <div>
      <div className="flex flex-col gap-3">
        <p className="font-medium text-neutral-950 text-2xl">
          Kết nối cộng đồng
        </p>
        <p>
          Đây là danh sách những người đã thích bạn và đối tượng phù hợp với
          bạn.
        </p>
        <p className=" text-lg flex justify-between items-center">
          Mới nhất <ChevronDown />
        </p>
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
    </div>
  );
};

export default Connect;
