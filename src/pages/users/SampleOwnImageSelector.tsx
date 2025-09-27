import { useNavigate } from "react-router";
import {
  api_PullAllImageDataForPetBSelection,
  getAccessToken,
} from "../../authentication";
import { useEffect, useState } from "react";

export interface ImageInfo {
  id: number;
  url: string;
  ts: number;
}

interface SampleOwnImageSelectorProps {
  other_image_hash: string | null;
  onSelect: (url: string) => void;
  onClose: () => void;
}

interface api_PullAllImageDataForPetBSelectionResponse {
  pets: {
    id: number;
    profile_picture_id: number | null;
    name: string | null;
    images: ImageInfo[];
  }[];
  user_images: ImageInfo[];
}

export default function SampleOwnImageSelector(
  props: SampleOwnImageSelectorProps
) {
  const navigate = useNavigate();
  const access_token = getAccessToken();
  const [component_state, set_component_state] =
    useState<api_PullAllImageDataForPetBSelectionResponse>();

  useEffect(() => {
    if (access_token == null) {
      console.log("Access token is null, redirecting to login page");
      navigate("/login");
      return;
    }

    async function fetch_image_list() {
      let retval = await api_PullAllImageDataForPetBSelection(
        access_token!,
        props.other_image_hash
      );

      console.debug(retval);

      if (retval.success) {
        try {
          set_component_state(retval.data!);
        } catch (error) {
          console.error(error);
          alert(`Error fetching image list: ${error}`);
          return;
        }
        // alert("Image uploaded successfully");
      } else {
        alert(`failed to fetch image list: ${retval.message}`);
      }
    }

    fetch_image_list();
  }, []);
  return (
    <div>
      {component_state == null ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>
            <button>upload new image | TODO</button>
            <button onClick={() => props.onClose()}>close</button>
          </div>
          <div id="pet_list">
            {component_state.pets.map((pet) => (
              <div key={pet.id} className="pet_item">
                <h3>{pet.name}</h3>
                <div className="image_list">
                  {pet.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={`Pet ${pet.name} Image ${image.id}`}
                      onClick={() => props.onSelect(image.url)}
                      style={{
                        cursor: "pointer",
                        maxWidth: "150px",
                        margin: "5px",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div id="user_image_list">
            {component_state.user_images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={`User Image ${image.id}`}
                onClick={() => props.onSelect(image.url)}
                style={{ cursor: "pointer", maxWidth: "150px", margin: "5px" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
