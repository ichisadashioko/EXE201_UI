export interface PetPicture {
  id: number;
  url: string;
  created_at: string;
}

export interface Pet {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  can_edit: boolean;
  profile_image_id: number | null;
  profile_image_url: string | null;
  images: PetPicture[]; // Add this to your Pet interface
}
