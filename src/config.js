// Remember to also update run.sh, Dockerfile and webpack.config.js
const config = {
  keycloak: {
    clientConfig: {
      realm: process.env.KEYCLOAK_REALM,
      url: process.env.KEYCLOAK_AUTH_URL,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
    },
    initOptions: {
      onLoad: 'login-required',
      checkLoginIframe: false,
    },
  },
  refdataApiUrl: process.env.REFDATA_API_URL,
  formApiUrl: process.env.FORM_API_URL,
  camundaApiUrl: '/camunda-proxy',
};

export default config;
