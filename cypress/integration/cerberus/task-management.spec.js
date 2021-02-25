describe('Verify Task Management Page', () => {
  beforeEach(() => {
    cy.fixture('users/cypressuser@lodev.xyz.json').then((user) => {
      cy.login(user.username);
    });
  });

  it('Should render all the tabs on task management page', () => {
    const taskNavigationItems = [
      'New',
      'In progress',
      'Paused',
      'Complete',
    ];
    const urls = [
      'new',
      'in-progress',
      'paused',
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

  it('Should check task details page', () => {
    cy.navigation('Tasks');

    cy.navigation('New');

    cy.contains('2021-58914').click();

    cy.url('include', '/COP-20201101-140');
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
