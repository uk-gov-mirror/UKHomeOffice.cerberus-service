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

  it('Should navigate to task details page', () => {
    cy.waitForTaskManagementPage();
    cy.get('.task-heading a').eq(0).invoke('text').then((text) => {
      cy.contains(text).click();
      cy.get('.govuk-caption-xl').should('have.text', text);
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

  it('Should verify notes added for the tasks', () => {
    const taskNotes = 'Add notes for testing & check it stored';
    cy.intercept('POST', '/camunda/task/*/comment/create').as('notes');
    cy.intercept('GET', 'camunda/task/*').as('tasksDetails');

    cy.waitForTaskManagementPage();

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

    cy.get('button.link-button').should('be.visible').click();

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

    cy.get('button.link-button').should('be.visible').click();
  });

  it('Should not show Notes for the tasks which is not assigned', () => {
    cy.intercept('GET', 'camunda/task/*').as('tasksDetails');

    cy.waitForTaskManagementPage();

    cy.getAssignedTasks().then((tasks) => {
      const taskId = tasks.map(((item) => item.id));
      expect(taskId.length).to.not.equal(0);
      cy.window().then((win) => win.location.href = `/tasks/${taskId[0]}`);
      cy.wait('@tasksDetails').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    cy.get('.govuk-heading-xl').should('have.text', 'Task details');

    cy.get('.formio-component-note textarea').should('not.exist');
  });

  after(() => {
    cy.contains('Sign out').click();
    cy.get('#kc-page-title').should('contain.text', 'Log In');
  });
});
