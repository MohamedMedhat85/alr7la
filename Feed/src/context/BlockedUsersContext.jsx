import React, { createContext, useContext, useState } from 'react';

const BlockedUsersContext = createContext();

export function BlockedUsersProvider({ children }) {
  const [blockedUsers, setBlockedUsers] = useState([]);

  const addBlockedUser = (user) => {
    setBlockedUsers(prev => [...prev, {
      ...user,
      blockedAt: new Date().toISOString(),
      reason: 'Blocked by user'
    }]);
  };

  const removeBlockedUser = (userId) => {
    setBlockedUsers(prev => prev.filter(user => user.id !== userId));
  };

  return (
    <BlockedUsersContext.Provider value={{ blockedUsers, addBlockedUser, removeBlockedUser }}>
      {children}
    </BlockedUsersContext.Provider>
  );
}

export function useBlockedUsers() {
  const context = useContext(BlockedUsersContext);
  if (!context) {
    throw new Error('useBlockedUsers must be used within a BlockedUsersProvider');
  }
  return context;
} 