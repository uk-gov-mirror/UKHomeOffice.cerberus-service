import 'cypress-keycloak-commands';

let token;

Cypress.Commands.add('login', (userName) => {
  cy.kcLogout();
  cy.kcLogin(userName).as('tokens');
  cy.log(`${Cypress.env('keycloakUrl')}/auth/realms/cop-dev/protocol/openid-connect/token`);
  cy.intercept('POST', `${Cypress.env('keycloakUrl')}/auth/realms/cop-dev/protocol/openid-connect/token`).as('token');
  cy.visit('/');

  cy.wait('@token').then(({ response }) => {
    token = response.body.access_token;
  });
});

Cypress.Commands.add('navigation', (option) => {
  cy.contains('a', option).click();
});

Cypress.Commands.add('waitForTaskManagementPageToLoad', () => {
  cy.intercept('POST', '/camunda/variable-instance?**').as('tasks');
  cy.navigation('Tasks');

  cy.wait('@tasks').then(({ response }) => {
    expect(response.statusCode).to.equal(200);
  });
});

Cypress.Commands.add('getTaskNotes', (taskId) => {
  const authorization = `bearer ${token}`;
  const options = {
    method: 'GET',
    url: `https://cerberus-service.dev.cerberus.cop.homeoffice.gov.uk/camunda/engine-rest/task/${taskId}/comment`,
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    return response.body[0].message;
  });
});

Cypress.Commands.add('getUnassignedTasks', () => {
  const authorization = `bearer ${token}`;
  const options = {
    method: 'GET',
    url: '/camunda/task?firstResult=0&maxResults=20',
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    return response.body.filter((item) => item.assignee === null);
  });
});

Cypress.Commands.add('getTasksAssignedToOtherUsers', () => {
  const authorization = `bearer ${token}`;
  const options = {
    method: 'GET',
    url: '/camunda/task?firstResult=0&maxResults=20',
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    return response.body.filter((item) => item.assignee !== 'cypressuser@lodev.xyz');
  });
});

Cypress.Commands.add('getTasksAssignedToMe', () => {
  const authorization = `bearer ${token}`;
  const options = {
    method: 'GET',
    url: '/camunda/task?firstResult=0&maxResults=20',
    headers: {
      authorization,
    },
  };

  cy.request(options).then((response) => {
    return response.body.filter((item) => item.assignee === 'cypressuser@lodev.xyz');
  });
});
