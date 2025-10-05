import { useNavigate } from "react-router";
import {
  api_PullAllImageDataForPetBSelection,
  api_upload_user_image,
  getAccessToken,
} from "../../authentication";
import { useEffect, useState } from "react";
import type { PetImageInfo } from "../../typing";

import "./SampleOwnImageSelector.css"

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

  const upload_file = async (file_obj: File) => {
    let retval = await api_upload_user_image(access_token!, file_obj);

    console.debug(retval);

    if (retval.success) {
      try {
        let image_info: PetImageInfo = retval.data.image_info;
        let image_url = image_info.url;
        props.onSelect(image_url);
      } catch (error) {
        console.error("Error uploading image:");
        console.error(error);
        alert(`Error uploading image: ${error}`);
        return;
      }
      // alert("Image uploaded successfully");
    } else {
      alert(`Failed to upload image: ${retval.message}`);
    }
  };

  function triggle_upload_action(el: HTMLInputElement) {
    console.log("Selected files:", el.files);
    if (el.files == null) {
      return;
    }
    if (el.files.length == 0) {
      return;
    }

    let file_obj = el.files[0];
    if (file_obj == null) {
      return;
    }

    console.log("Selected file:", file_obj);
    upload_file(file_obj).finally(() => {
      // reset input value so selecting the same file again will trigger change event
      el.value = "";
    });
  }

  return (
    <div
      className="image-selector-popup"
      style={{
        // display: "block",
        // position: "fixed",
        // top: "10vh",
        // left: "10vw",
        // width: "80vw",
        // height: "80vh",
        // backgroundColor: "black",
        // maxHeight: "80vh",
        // overflowY: "scroll",
        zIndex: 1000, // TODO dynamic z-index as input argument
      }}
    >
      {component_state == null ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>
            <div className="container section">
              <h2>upload new image from your device</h2>
              <input
                type="file"
                accept="image/*"
                id="ai_image_gen_input_upload_image"
                onChange={(evt) => {
                  console.debug(evt);
                  triggle_upload_action(evt.target);
                }}
              />
              <button
                className="button"
                onClick={async () => {
                  const input_elem = document.getElementById(
                    "ai_image_gen_input_upload_image"
                  ) as HTMLInputElement;
                  if (input_elem == null) {
                    console.error(
                      "ai_image_gen_input_upload_image element not found"
                    );
                    alert("ai_image_gen_input_upload_image element not found");
                    return;
                  }

                  input_elem.click();
                  // triggle_upload_action(input_elem);
                }}
              >
                upload
              </button>
            </div>
            <button
              className="button"
              onClick={() => props.onClose()}>close</button>
          </div>
          <div id="pet_list">
            {component_state.pets
              .filter((pet) => (pet.images.length > 0))
              .map((pet) => (
                <div key={pet.id} className="pet_item">
                  <h3>{pet.name}</h3>
                  <div
                    className="image_list"
                  >
                    {pet.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt={`Pet ${pet.name} Image ${image.id}`}
                        onClick={() => props.onSelect(image.url)}
                        className="image-list-item"
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
          <div
            id="user_image_list"
            style={{ display: "flex", flexWrap: "wrap" }}
          >
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
