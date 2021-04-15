import React, {
  createContext, useState, useContext, useEffect,
} from 'react';
import Keycloak from 'keycloak-js';
import { useInterval } from 'react-use';

import config from '../config';

const KeycloakContext = createContext();

const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [timeToExpire, setTimeToExpire] = useState(null);

  const keycloakInstance = Keycloak(config.keycloak.clientConfig);

  useInterval(() => {
    keycloak
      .updateToken()
      .catch(() => {
        keycloak.logout();
      });
  }, keycloak ? timeToExpire : null);

  useEffect(() => {
    keycloakInstance.init(config.keycloak.initOptions).then((authenticated) => {
      if (authenticated) {
        setKeycloak(keycloakInstance);
        setTimeToExpire(new Date(keycloakInstance.tokenParsed.exp * 1000) - new Date());
      } else {
        keycloakInstance.login();
      }
    });
  }, []);

  return <KeycloakContext.Provider value={keycloak}>{children}</KeycloakContext.Provider>;
};

const useKeycloak = () => useContext(KeycloakContext);

export { KeycloakContext, KeycloakProvider, useKeycloak };
