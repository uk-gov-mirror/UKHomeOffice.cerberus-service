import React, { createContext, useState, useContext } from 'react';


const TokenContext = createContext();

const ContextProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [authenticated, setAuthenticated] = useState(false);

  let values = { token, setToken, authenticated, setAuthenticated };

  return <TokenContext.Provider value={values}>{children}</TokenContext.Provider>;
};

const useToken = () => {
    const context = useContext(TokenContext);
    const { keycloak, setKeycloak, token, setToken, authenticated, setAuthenticated } = context;
    
    return { keycloak, setKeycloak, token, setToken, authenticated, setAuthenticated };
};

export { TokenContext, ContextProvider, useToken };
