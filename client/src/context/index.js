import React, { createContext, useState } from "react";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);



  return (
    <Context.Provider value={{ wishlistCount, setWishlistCount }}>
      {children}
    </Context.Provider>
  );
};

export default Context;