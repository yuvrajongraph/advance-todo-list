import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const useAuth = () => {
  const [authenticated, setAutenticated] = useState(false);
  // to retreive the detail from cookie 
  const [cookies] = useCookies(["userData"]);
  const data = cookies;
  useEffect(() => {
    // set the authenticate state variable to true if user is login and authenticated
    if (JSON.stringify(data) !== JSON.stringify({})) {
      setAutenticated(true);
    }
  }, []);
  return [authenticated, cookies];
};

export default useAuth;
