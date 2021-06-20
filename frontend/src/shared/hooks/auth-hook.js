import { useCallback, useState } from "react";
import jwt_decode from "jwt-decode";
let timepoutPointer = null;
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState();

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("userToken");
    clearTimeout(timepoutPointer);
  }, []);

  const login = useCallback(
    (token) => {
      setIsLoggedIn(true);
      localStorage.setItem("userToken", token);
      let decoded = jwt_decode(token);
      timepoutPointer = setTimeout(() => {
        logout();
      }, decoded.EXPIRY_TOKEN * 1000);
    },
    [logout]
  );

  return [isLoggedIn, user, setUser, token, setToken, login, logout];
};

export default useAuth;
