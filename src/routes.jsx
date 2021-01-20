import Keycloak from 'keycloak-js';
import React, { BrowserRouter, useState, useEffect } from 'react';

// app imports
import Header from './components/App/Header';
import config from './config/core';
import { useToken } from './reducers';


const Routes = () => {
  const [keycloak, setKeycloak] = useState('');
  const { setToken, setAuthenticated, authenticated } = useToken();

  useEffect(() => {
    const kc = Keycloak(config.kcInitOptions);

    kc.init({ onload: 'login-required', 'checkLoginIframe': false }).then(authenticated => {
      if (authenticated) {
        setKeycloak({keycloak: kc, authenticated: authenticated})
        setToken(kc.token);
        setAuthenticated(authenticated);
      } else {
        kc.login();
      }
    });
  }, [setToken, setAuthenticated]);

  if (authenticated) {
    return(
        <Header kc={keycloak.keycloak}/>
    )
  } else {
    return <p></p>
  }
};

export default Routes;
