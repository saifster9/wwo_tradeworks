import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Optionally initialize from localStorage if you want persistence on refresh
    const storedUser = localStorage.getItem('userData');
    return storedUser ? JSON.parse(storedUser) : { userId: null, firstName: '' };
  });

  // Optional: Sync changes to localStorage
  useEffect(() => {
    if (user && user.userId) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
