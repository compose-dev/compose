import { useContext } from "react";
import { authContext, AuthContextData } from "./authContext";

function useAuthContext(): AuthContextData {
  const context = useContext(authContext);

  if (context === null) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}

export { useAuthContext };
