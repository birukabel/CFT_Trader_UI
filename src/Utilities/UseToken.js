import { useState } from "react";

export function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("userToken");
    const userToken = JSON.parse(tokenString);
    if(userToken)
        return userToken;
    return '';
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {

    localStorage.setItem("userToken", JSON.stringify(userToken));
    setToken(userToken);    
  };

  return {
    setToken: saveToken,
    token,
  };
}
