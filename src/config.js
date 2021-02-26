const config = {
  keycloak: {
    clientConfig: {
      realm: process.env.KEYCLOAK_REALM || 'cop-dev',
      url: process.env.KEYCLOAK_AUTH_URL || 'https://sso-dev.notprod.homeoffice.gov.uk/auth',
      clientId: process.env.KEYCLOAK_CLIENT_ID || 'cerberus',
    },
    initOptions: {
      onLoad: 'login-required',
      checkLoginIframe: false,
    },
  },
  refdataApiUrl: process.env.REFDATA_API_URL,
  formApiUrl: process.env.FORM_API_URL,
};

export default config;
