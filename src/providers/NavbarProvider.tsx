import { useState } from "react";
import { NavbarContext } from "./NavbarContext";

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState("home");
  return (
    <NavbarContext.Provider
      value={{
        setState,
        state,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};
