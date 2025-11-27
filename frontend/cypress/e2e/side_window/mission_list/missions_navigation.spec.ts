context('Mission', () => {
  beforeEach(() => {
    cy.login('superuser')
  })

  it('Missions should be created and saved in store When auto-save is not enabled', () => {
    cy.visit(`/side_window`, {
      onBeforeLoad: () => {
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'false')
      }
    })

    // We create the first mission and add mission types
    cy.clickButton('Ajouter une nouvelle mission')
    cy.wait(500)

    // 2 items + div as border
    cy.get('*[data-cy="missions-nav"] > div').should('have.length', 3)

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })
    cy.wait(500)

    // we create a second mission and add administration and unit
    cy.get('[data-cy="mission-0"]').first().forceClick()
    cy.clickButton('Ajouter une nouvelle mission')
    cy.wait(500)
    // 3 items + div as border
    cy.get('*[data-cy="missions-nav"] > div').should('have.length', 4)

    cy.fill('Unité 1', 'Cross Etel')
    cy.wait(500)

    // we close the first mission and display the confirm cancel modal
    cy.clickButton('Fermer Nouvelle mission - Cross Etel')
    cy.clickButton("Retourner à l'édition")

    // navigate between reportings and missions
    cy.clickButton('Signalements')
    cy.clickButton('Missions et contrôles')

    // we want to check whether the second mission has been saved correctly
    cy.get('[data-cy="mission-2"]').first().forceClick().wait(250)
    cy.getDataCy('add-control-administration').contains('DIRM / DM')
    cy.getDataCy('add-control-unit').contains('Cross Etel')
  })

  it('Missions should be created and saved in store When auto-save is enabled', () => {
    cy.visit(`/side_window`)

    // We create the first mission and add mission types
    cy.clickButton('Ajouter une nouvelle mission')
    cy.wait(500)

    // 2 items + div as border
    cy.get('*[data-cy="missions-nav"] > div').should('have.length', 3)

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })
    cy.wait(500)

    // we create a second mission and add administration and unit
    cy.get('[data-cy="mission-0"]').first().forceClick()
    cy.clickButton('Ajouter une nouvelle mission')
    cy.wait(500)

    // 3 items + div as border
    cy.get('*[data-cy="missions-nav"] > div').should('have.length', 4)

    cy.fill('Unité 1', 'Cross Etel')
    cy.wait(500)

    // we close the first mission and display the confirm cancel modal
    cy.clickButton('Fermer Nouvelle mission - Cross Etel')
    cy.clickButton("Retourner à l'édition")

    // navigate between reportings and missions
    cy.clickButton('Signalements')
    cy.clickButton('Missions et contrôles')

    // we want to check whether the second mission has been saved correctly
    cy.get('[data-cy="mission-2"]').first().forceClick().wait(250)
    cy.getDataCy('add-control-administration').contains('DIRM / DM')
    cy.getDataCy('add-control-unit').contains('Cross Etel')
  })
})
