import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({
  user: { userId: null, firstName: '', role: '' },
  setUser: () => {}
});

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    userId: null,
    firstName: '',
    role: ''
  });

  useEffect(() => {
    const userId    = localStorage.getItem('userId');
    const firstName = localStorage.getItem('firstName');
    const role      = localStorage.getItem('role');
    if (userId) {
      setUser({ userId, firstName, role });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}