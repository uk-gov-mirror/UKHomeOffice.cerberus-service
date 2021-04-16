describe('Render tasks from Camunda and manage them on task management and details Page', () => {
  beforeEach(() => {
    cy.fixture('users/cypressuser@lodev.xyz.json').then((user) => {
      cy.login(user.username);
    });
  });

  it('Should navigate to task details page', () => {
    cy.waitForTaskManagementPageToLoad();
    cy.get('.task-heading a').eq(0).invoke('text').then((text) => {
      cy.contains(text).click();
      cy.get('.govuk-caption-xl').should('have.text', text);
    });
  });

  it('Should add notes for the selected tasks', () => {
    const taskNotes = 'Add notes for testing & check it stored';
    cy.intercept('POST', '/camunda/task/*/comment/create').as('notes');
    cy.intercept('GET', '/camunda/task/*').as('tasksDetails');

    cy.waitForTaskManagementPageToLoad();

    cy.getUnassignedTasks().then((tasks) => {
      const taskId = tasks.map(((item) => item.id));
      expect(taskId.length).to.not.equal(0);
      cy.visit(`/tasks/${taskId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.get('.govuk-heading-xl').should('have.text', 'Task details');

    cy.wait(2000);

    cy.get('button.link-button').should('be.visible').and('have.text', 'Claim').click();

    cy.get('.formio-component-note textarea')
      .should('be.visible')
      .type(taskNotes, { force: true });

    cy.get('.formio-component-submit button').click('top');

    cy.wait('@notes').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
      expect(response.body.message).to.contain(taskNotes);
      cy.getTaskNotes(response.body.taskId).then((message) => {
        expect(message).to.equal(taskNotes);
      });
    });

    cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim').click();
  });

  it('Should hide Notes Textarea for the tasks assigned to others', () => {
    cy.intercept('GET', '/camunda/task/*').as('tasksDetails');

    cy.waitForTaskManagementPageToLoad();

    cy.getTasksAssignedToOtherUsers().then((tasks) => {
      const taskId = tasks.map(((item) => item.id));
      expect(taskId.length).to.not.equal(0);
      cy.visit(`/tasks/${taskId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.get('.govuk-heading-xl').should('have.text', 'Task details');

    cy.get('.formio-component-note textarea').should('not.exist');
  });

  it('Should Unclaim a task Successfully from task details page', () => {
    cy.intercept('GET', '/camunda/task/*').as('tasksDetails');
    cy.intercept('POST', '/camunda/task/*/unclaim').as('unclaim');

    cy.waitForTaskManagementPageToLoad();

    cy.getTasksAssignedToMe().then((tasks) => {
      const taskId = tasks.map(((item) => item.id));
      expect(taskId.length).to.not.equal(0);
      cy.visit(`/tasks/${taskId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.wait(2000);

    cy.get('button.link-button').should('be.visible').and('have.text', 'Unclaim').click();

    cy.wait('@unclaim').then(({ response }) => {
      expect(response.statusCode).to.equal(204);
    });

    cy.wait(2000);

    cy.get('button.link-button').should('have.text', 'Claim').click();
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
