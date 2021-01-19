import Keycloak from 'keycloak-js';
import React, { createContext, useState } from 'react';
import { render } from 'react-dom';

// app imports
import Routes from './routes';
import { ContextProvider } from './reducers';


render(
  <ContextProvider>
    <Routes/>
  </ContextProvider>,
  document.getElementById('root'),
)
