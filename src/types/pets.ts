export interface Pet {
  id: number;
  name: string;
  description: string;
  profile_image_id: number | null;
  profile_image_url: string | null;
  created_at: string; // Dates are typically strings in JSON
}
