describe('Sign-in to cerberus UI', () => {
  beforeEach(() => {
    cy.fixture('users/cypressuser@lodev.xyz.json').then((user) => {
      cy.login(user.username);
    });
  });

  it('Should Sign-in Successfully', () => {
    const urls = [
      '/tasks',
      '/issue-target'
    ];
    cy.get('#main-content p').should('contain.text', 'Cypress User!');

    cy.get('#navigation li a').each((navigationItem, index) => {
      cy.wrap(navigationItem).click();
      cy.url().should('include', urls[index]);
    });
  });

});
