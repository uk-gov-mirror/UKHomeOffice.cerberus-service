import 'cypress-keycloak-commands';

Cypress.Commands.add('login', (userName) => {
  cy.kcLogout();
  cy.kcLogin(userName).as('tokens');
  cy.visit('/');
});
