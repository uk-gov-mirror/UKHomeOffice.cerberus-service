import React from 'react';
import { render } from 'react-dom';
import AppRouter from './routes';
import { KeycloakProvider } from './utils/keycloak';
import './__assets__/index.scss';

render(
  <KeycloakProvider>
    <AppRouter />
  </KeycloakProvider>,
  document.getElementById('root'),
);
