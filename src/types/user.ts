import type { Pet } from "./pets";

export interface UserProfile {
  id: number;
  name: string | null;
  is_guest: boolean;
  created_at: string; // Dates are typically strings in JSON
  pets: Pet[];
}
