import type { Pet } from "../../types/pets";
import PetsCard from "../../components/pets/PetsCard";

const PetsList = ({ pets }: { pets: Pet[] }) => {
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

export default PetsList;
