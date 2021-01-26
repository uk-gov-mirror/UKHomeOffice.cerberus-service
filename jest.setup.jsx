import React from 'react';
import '@testing-library/jest-dom'
import 'regenerator-runtime/runtime';

jest.mock('./src/utils/keycloak', () => ({
  KeycloakProvider: ({ children }) => children,
  useKeycloak: () => ({
    token: 'token',
      authServerUrl: 'test',
      realm: 'test',
      clientId: 'client',
      refreshToken: 'refreshToken',
      tokenParsed: {
      given_name: 'test',
        family_name: 'test',
        email: 'test',
        realm_access: {
        roles: ['test'],
      },
      team_id: '21',
    },
    createLogoutUrl: jest.fn(() => 'http://example.com/logout'),
  }),
}));

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({
    pathname: '/example',
  })),
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

