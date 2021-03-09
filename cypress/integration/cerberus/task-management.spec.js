/// <reference types="Cypress"/>
/// <reference path="../support/index.d.ts" />

describe('Verify Task Management Page', () => {
  const MAX_TASK_PER_PAGE = 3;

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

  it('Should navigate to task details page', () => {
    cy.navigation('Tasks');

    cy.get('.task-heading a.task-view').eq(0).invoke('text').then((text) => {
      cy.contains(text).click();
      cy.url().should('include', text);
    });
  });

  it('Should hide first and prev buttons on first page', () => {
    cy.navigation('Tasks');

    cy.get('.pagination--list a').then(($items) => {
      const texts = Array.from($items, (el) => el.innerText);
      expect(texts).not.to.contain(['First', 'Previous']);
    });

    cy.get('.pagination--summary').should('contain.text', 'Showing 1 - 3');
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

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });

});
