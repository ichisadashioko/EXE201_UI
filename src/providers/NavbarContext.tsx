import { createContext } from "react";
interface NavbarContextType {
  state: string;
  setState: (path: string) => void;
}
export const NavbarContext = createContext<NavbarContextType | undefined>(
  undefined
);
