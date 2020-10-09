describe('create an update', () => {
  before(() => {
    cy.login({ redirect: '/testcollective/updates/new' });
  });

  it('edit info', () => {
    cy.wait(1000);
    cy.get('[data-cy=titleInput]').type('New update');
    cy.get('.ql-editor').type('This is some bold HTML{selectall}');
    cy.get('.ql-bold').click();
    cy.wait(300);
    cy.get('.actions button').click();
    cy.wait(1000);
    cy.get('[data-cy=updateTitle]', { timeout: 10000 }).contains('New update');
    cy.get('[data-cy=meta]').contains('draft');
    cy.get('[data-cy="privateIcon"]').should('not.exist');
    cy.get('[data-cy=PublishUpdateBtn]').contains('Your update will be sent to');
    cy.getByDataCy('btn-publish').click();
    cy.get('[data-cy=meta]').contains('draft').should('not.exist');

    cy.get('[data-cy=toggleEditUpdate').click();
    cy.wait(300);
    cy.get('[data-cy="custom-checkbox"').click(); // Make private
    cy.get('.actions button').click();
    cy.wait(1000);
    cy.get('[data-cy="privateIcon"]').should('exist');
  });
});

describe('random user cannot see update', () => {
  it('cannot view private update', () => {
    cy.visit('/testcollective/updates');
    cy.get('[data-cy=updateTitle]').first().click(); // The update created in the describe block above.
    cy.wait(500);
    cy.get('[data-cy=mesgBox]').contains('Become a backer of');
    cy.get('[data-cy=mesgBox]').contains('to see this update');
  });
});
