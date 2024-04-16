import { customDayjs } from '@mtes-mct/monitor-ui'

context('Side Window > Mission Form > Validation on close', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad: () => {
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'true')
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
      }
    })
  })

  it('A new mission with control and surveillance can be closed with all required values When auto-save is enabled', () => {
    cy.get('*[data-cy="add-mission"]').click()
    cy.wait(500)

    // we fill all the required inputs
    cy.fill('Date de début (UTC)', [2023, 10, 11, 7, 35])
    cy.wait(250)
    cy.fill('Date de fin (UTC)', [customDayjs().year() + 1, 10, 12, 7, 35])
    cy.wait(250)
    cy.fill('Type de mission', ['Air'])
    cy.wait(250)
    cy.fill('Unité 1', 'Cross Gris Nez')
    cy.clickOutside()
    cy.wait(250)
    cy.fill("Contact de l'unité 1", 'contact')
    cy.wait(250)
    cy.fill('Ouvert par', 'PCF')
    cy.wait(1000)

    cy.clickButton('Clôturer')
    cy.wait(500)

    cy.fill('Clôturé par', 'PCF')
    cy.wait(500)

    // we add a control
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')
    cy.wait(250)

    // can't test this one because there is map interaction
    // cy.contains('Point de contrôle requis').should('exist')

    // we fill all the required inputs
    cy.fill('Thématique de contrôle', 'Police des espèces protégées')
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-theme-element"]').contains("Perturbation d'animaux").click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)
    cy.fill('Date et heure du contrôle (UTC)', [2023, 10, 11, 12, 12])
    cy.wait(250)

    cy.fill('Nb total de contrôles', 2)
    cy.wait(250)
    cy.fill('Type de cible', 'Personne morale')
    cy.wait(250)

    // we add an infraction
    cy.clickButton('+ Ajouter un contrôle avec infraction')
    cy.wait(250)
    cy.fill("Type d'infraction", 'Avec PV')
    cy.wait(250)
    cy.fill('Mise en demeure', 'Oui')
    cy.wait(250)
    cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])
    cy.wait(250)

    // we add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.wait(250)

    cy.fill('Thématique de surveillance', 'Rejets illicites')
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-theme-element"]').contains('Jet de déchet').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)

    // delete theme to test error
    cy.fill('Thématique de surveillance', '')
    cy.wait(250)

    cy.fill('Thématique de surveillance', 'Rejets illicites')
    cy.wait(250)
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Jet de déchet').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
  })

  it('A new mission with control and surveillance can be closed with all required values When auto-save is disabled (because of old mission)', () => {
    cy.intercept('PUT', '/bff/v1/missions/*').as('createAndCloseMission')
    cy.get('*[data-cy="add-mission"]').click()
    cy.wait(500)

    // we fill all the required inputs
    // since we fill dates with past dates autosaved is disabled
    cy.getDataCy('mission-status-tag-pending').should('exist')
    cy.getDataCy('completion-mission-status-tag-to-completed').should('exist')
    cy.fill('Date de début (UTC)', [2023, 10, 11, 7, 35])
    cy.wait(250)
    cy.fill('Date de fin (UTC)', [2023, 10, 12, 7, 35])
    cy.getDataCy('mission-status-tag-pending').should('not.exist')
    cy.getDataCy('mission-status-tag-ended').should('exist')
    cy.wait(250)
    cy.fill('Type de mission', ['Air'])
    cy.wait(250)
    cy.fill('Unité 1', 'Cross Etel')
    cy.clickOutside()
    cy.wait(250)
    cy.fill("Contact de l'unité 1", 'contact')
    cy.wait(250)
    cy.fill('Ouvert par', 'PCF')

    cy.wait(500)
    cy.clickButton('Clôturer')
    cy.wait(250)
    cy.fill('Clôturé par', 'PCF')

    // we add a control
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')
    cy.wait(250)

    // we fill all the required inputs
    cy.fill('Thématique de contrôle', 'Police des espèces protégées')
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-theme-element"]').contains("Perturbation d'animaux").click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)
    cy.fill('Date et heure du contrôle (UTC)', [2023, 10, 11, 12, 12])
    cy.wait(250)

    cy.fill('Nb total de contrôles', 2)
    cy.wait(250)
    cy.fill('Type de cible', 'Personne morale')
    cy.wait(250)

    // we add an infraction
    cy.clickButton('+ Ajouter un contrôle avec infraction')
    cy.wait(250)
    cy.fill("Type d'infraction", 'Avec PV')
    cy.wait(250)
    cy.fill('Mise en demeure', 'Oui')
    cy.wait(250)
    cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])
    cy.wait(250)

    // we add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.wait(250)

    cy.fill('Thématique de surveillance', 'Rejets illicites')
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-theme-element"]').contains('Jet de déchet').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)

    // delete theme to test error
    cy.fill('Thématique de surveillance', '')
    cy.wait(250)

    cy.fill('Thématique de surveillance', 'Rejets illicites')
    cy.wait(250)
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-theme-element"]').contains('Jet de déchet').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)

    cy.getDataCy('completion-mission-status-tag-completed').should('exist')

    cy.clickButton('Enregistrer')

    cy.wait('@createAndCloseMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
  })
})
