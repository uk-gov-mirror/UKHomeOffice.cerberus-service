import 'cypress-keycloak-commands';

Cypress.Commands.add('login', (userName) => {
  cy.kcLogout();
  cy.kcLogin(userName).as('tokens');
  cy.visit('/');
});

Cypress.Commands.add('navigation', (option) => {
  cy.contains('a', option).click();
});
