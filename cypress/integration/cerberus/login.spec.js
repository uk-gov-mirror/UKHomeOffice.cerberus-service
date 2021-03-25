describe('Sign-in to cerberus UI', () => {
  beforeEach(() => {
    cy.fixture('users/cypressuser@lodev.xyz.json').then((user) => {
      cy.login(user.username);
    });
  });

  it('Should Sign-in Successfully', () => {
    cy.url().should('include', '/tasks');

    cy.get('.govuk-heading-xl').should('contain.text', 'Task management');

    cy.contains('Issue a target').click();
    cy.url().should('include', '/issue-target');

    cy.contains('Tasks').click();
    cy.url().should('include', '/tasks');

  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
