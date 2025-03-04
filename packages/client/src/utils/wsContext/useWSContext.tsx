import { useContext } from "react";
import { WSContext, WSContextData } from "./WSContext";

function useWSContext(): WSContextData {
  const context = useContext(WSContext);

  if (context === null) {
    throw new Error("useWSContext must be used within a WS Provider");
  }

  return context;
}

export { useWSContext };
