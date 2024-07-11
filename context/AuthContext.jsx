import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data to local storage
    localStorage.setItem("token", token); // Save token to local storage
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user"); // Remove user data from local storage
    localStorage.removeItem("token"); // Remove token from local storage
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
