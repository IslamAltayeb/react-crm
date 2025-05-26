import React, { createContext, useContext, useState } from 'react';

type MyContextType = {
  drawerWidth: number;
  setDrawerWidth: (newWidth: number) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  userInfo: any;
  setUserInfo: (info: any) => void;
};

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider = ({ children }: { children: React.ReactNode }) => {
  const [drawerWidth, setDrawerWidth] = useState<number>(200);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  return (
    <MyContext.Provider
      value={{
        drawerWidth,
        setDrawerWidth,
        isDrawerOpen,
        setIsDrawerOpen,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
