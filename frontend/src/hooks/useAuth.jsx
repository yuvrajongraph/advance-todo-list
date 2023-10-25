import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const useAuth = () => {
  const [authenticated, setAutenticated] = useState(false);
  const [cookies] = useCookies(["userData"]);
  const data = cookies;
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify({})) {
      setAutenticated(true);
    }
  }, []);
  return [authenticated, cookies];
};

export default useAuth;
