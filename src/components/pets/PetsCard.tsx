import { Link } from "react-router-dom";
import type { Pet } from "../../types/pets";
import { NextICon } from "../icon/NextICon";

const PetsCard = ({ pet }: { pet: Pet }) => {
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

export default PetsCard;
