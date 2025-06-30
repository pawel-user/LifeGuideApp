import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const token = localStorage.getItem('token');
    return token || "";
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    const tokenString = typeof userToken === 'object' && userToken?.token ? userToken.token : userToken;
    if (tokenString) {
      localStorage.setItem('token', tokenString);
      setToken(tokenString);
    } else {
      localStorage.setItem('token', "");
      setToken("");
    }
  };

  const deleteToken = () => {
    localStorage.removeItem('token');
    setToken("");
  };

  return {
    setToken: saveToken,
    token,
    deleteToken,
  };
}
