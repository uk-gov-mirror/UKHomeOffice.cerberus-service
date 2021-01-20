const keycloakAuthUrl = process.env.KEYCLOAK_AUTH_URL || 'https://sso-dev.notprod.homeoffice.gov.uk/auth';
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || 'cerberus';
const keycloakRealm = process.env.KEYCLOAK_REALM || 'cop-dev';

const kcInitOptions = {
  realm: keycloakRealm,
  url: keycloakAuthUrl,
  clientId: keycloakClientId,
};

const config = {
  kcInitOptions,
};

export default config;

