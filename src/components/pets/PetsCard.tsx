import { Card } from "react-bootstrap";
import type { Pet } from "../../types/pets";

const PetsCard = ({ pet }: { pet: Pet }) => {
  return (
    <div>
      {" "}
      {/* {pet.profile_image_url && (
        <img
          src={pet.profile_image_url}
          alt={pet.name}
          style={{
            // width: "50px",
            // height: "50px",
            marginRight: "10px",
            verticalAlign: "middle",
            borderRadius: "5px",
          }}
        />
      )} */}
      <p>{pet.name}</p>
    </div>
  );
};

export default PetsCard;
