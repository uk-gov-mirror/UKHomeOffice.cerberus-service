/// <reference types="Cypress"/>
/// <reference path="../support/index.d.ts" />

describe('Render tasks from Camunda and manage them on task management and details Page', () => {
  const MAX_TASK_PER_PAGE = 10;

  beforeEach(() => {
    cy.fixture('users/cypressuser@lodev.xyz.json').then((user) => {
      cy.login(user.username);
    });
  });

  it('Should render all the tabs on task management page', () => {
    const taskNavigationItems = [
      'New',
      'In progress',
      'Complete',
    ];
    const urls = [
      'new',
      'in-progress',
      'complete',
    ];

    cy.navigation('Tasks');

    cy.get('.govuk-tabs__list li a').each((navigationItem, index) => {
      cy.wrap(navigationItem).click()
        .should('contain.text', taskNavigationItems[index]).and('be.visible')
        .and('have.attr', 'aria-selected', 'true');
      cy.url().should('include', urls[index]);
    });
  });

  it('Should hide first and prev buttons on first page', () => {
    cy.navigation('Tasks');

    cy.get('.pagination--list a').then(($items) => {
      const texts = Array.from($items, (el) => el.innerText);
      expect(texts).not.to.contain(['First', 'Previous']);
    });

    cy.get('.pagination--summary').should('contain.text', `Showing 1 - ${MAX_TASK_PER_PAGE}`);
  });

  it('Should hide last and next buttons on last page', () => {
    cy.navigation('Tasks');

    cy.get('.pagination--list a').last().click();

    cy.get('.pagination--list a').then(($items) => {
      const texts = Array.from($items, (el) => el.innerText);
      expect(texts).not.to.contain(['Next', 'Last']);
    });
  });

  it('Should maintain the page links count', () => {
    cy.navigation('Tasks');

    cy.get('.task-list--item').should('have.length', MAX_TASK_PER_PAGE);

    cy.get('a[data-test="page-number"]').each((item) => {
      cy.wrap(item).click();
      cy.get('.task-list--item').its('length').should('be.lte', MAX_TASK_PER_PAGE);
    });
  });

  it('Should verify refresh task list page', () => {
    cy.intercept('POST', '/camunda/variable-instance?*').as('tasks');
    cy.clock();

    cy.tick(60000);

    cy.wait('@tasks').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.get('.pagination--list a').eq(1).click();

    cy.tick(60000);

    cy.wait('@tasks').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });

    cy.url().should('contain', 'page=2');
  });

  it('Should Unclaim & claim a task Successfully from task management page', () => {
    cy.intercept('POST', '/camunda/task/*/claim').as('claim');
    cy.intercept('POST', '/camunda/task/*/unclaim').as('unclaim');

    cy.waitForTaskManagementPageToLoad();

    cy.get('.pagination--list a').eq(1).click();

    cy.get('.govuk-grid-row a[href="/tasks/63003627-66f9-11eb-96c5-4ae7c71d76e6"]')
      .parentsUntil('.task-list--item').within(() => {
        cy.get('button.link-button')
        .should('have.text', 'Unclaim')
          .click();
    });

    cy.wait('@unclaim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);

    cy.get('.govuk-grid-row a[href="/tasks/63003627-66f9-11eb-96c5-4ae7c71d76e6"]')
        .parentsUntil('.task-list--item').within(() => {
           cy.get('button.link-button')
          .should('have.text', 'Claim')
          .click();
    });

    cy.wait('@claim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
