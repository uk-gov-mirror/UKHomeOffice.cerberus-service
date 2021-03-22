describe('Sign-in to cerberus UI', () => {
  beforeEach(() => {
    cy.fixture('users/cypressuser@lodev.xyz.json').then((user) => {
      cy.login(user.username);
    });
  });

  it('Should Sign-in Successfully', () => {
    const navigationItems = [
      'Tasks',
      'Issue a target',
      'Sign out',
    ];

    cy.url().should('include', '/tasks');

    cy.get('.govuk-heading-xl').should('contain.text', 'Task management');

    cy.get('#navigation li a').each((navigationItem, index) => {
      cy.wrap(navigationItem).should('contain.text', navigationItems[index]).and('be.visible');
    });
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
