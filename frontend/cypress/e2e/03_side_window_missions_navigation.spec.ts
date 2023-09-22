context('Mission', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('Missions should be created and saved in store', () => {
    // We create the first mission and add mission types
    cy.clickButton('Ajouter une nouvelle mission')
    // because of the NavBar responsive component, we have two navs components mounted
    // so we have double the number of real tabs open
    cy.get('*[data-cy="missions-nav"] > a').should('have.length', 4)

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    // we create a second mission and add administration and unit
    cy.get('[data-cy="mission-0"]').click({ force: true, multiple: true })
    cy.clickButton('Ajouter une nouvelle mission')

    // because of the NavBar responsive component, we have two navs components mounted
    // so we have double the number of real tabs open
    cy.get('*[data-cy="missions-nav"] > a').should('have.length', 6)

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')

    // we close the first mission and display the confirm cancel modal
    cy.get('[data-cy="mission-1"] > svg').click({ force: true, multiple: true })
    cy.clickButton("Retourner à l'édition")

    // we want to check whether the second mission has been saved correctly
    cy.get('[data-cy="mission-2"]').click({ force: true, multiple: true })
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')
  })
})
