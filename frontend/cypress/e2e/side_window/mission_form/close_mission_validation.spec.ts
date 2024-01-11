import {customDayjs} from "@mtes-mct/monitor-ui";

context('Side Window > Mission Form > Validation on close', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('A new mission with control and surveillance can be closed with all required values When auto-save is enabled', () => {
    // Given
    cy.get('*[data-cy="add-mission"]').click()
    cy.wait(500)
    cy.wait(500)
    cy.clickButton('Clôturer')
    cy.wait(500)

    cy.get('*[data-cy="mission-errors"]').should('exist')
    cy.contains('Date de fin requise').should('exist')
    cy.contains('Type de mission').should('exist')
    cy.contains('Administration requise').should('exist')
    cy.contains('Unité requise').should('exist')
    cy.contains("Trigramme d'ouverture requis").should('exist')
    cy.contains('Trigramme de clôture requis').should('exist')

    // we fill all the required inputs
    cy.fill('Début de mission (UTC)', [2023, 10, 11, 7, 35])
    cy.wait(250)
    cy.fill('Fin de mission (UTC)', [customDayjs().year() + 1, 10, 12, 7, 35])
    cy.wait(250)
    cy.fill('Type de mission', ['Air'])
    cy.wait(250)
    cy.get('*[data-cy="add-control-unit"]').click()
    cy.wait(250)
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.wait(250)
    cy.fill("Contact de l'unité 1", 'contact').scrollIntoView()
    cy.wait(250)
    cy.fill('Ouvert par', 'PCF').scrollIntoView()
    cy.wait(500)
    cy.fill('Clôturé par', 'PCF').scrollIntoView()

    cy.get('*[data-cy="mission-errors"]').should('not.exist')

    // we add a control
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')
    cy.wait(250)

    cy.get('*[data-cy="mission-errors"]').should('exist')
    cy.contains('Thème requis').should('exist')
    cy.contains('Sous-thématique requise').should('exist')
    cy.contains('Date requise').should('exist')
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

    cy.fill('Nombre total de contrôles', '2')
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

    cy.get('*[data-cy="mission-errors"]').should('not.exist')

    // we add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.wait(250)

    cy.get('*[data-cy="mission-errors"]').should('exist')

    cy.fill('Thématique de surveillance', 'Rejets illicites')
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-theme-element"]').contains('Jet de déchet').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)

    cy.getDataCy('surveillance-zone-matches-mission').should('have.class', 'rs-checkbox-checked')
    cy.get('*[data-cy="mission-errors"]').should('not.exist')

    // delete theme to test error
    cy.fill('Thématique de surveillance', '')
    cy.wait(250)
    cy.get('*[data-cy="mission-errors"]').should('exist')

    cy.fill('Thématique de surveillance', 'Rejets illicites')
    cy.wait(250)
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-theme-element"]').contains('Jet de déchet').click({ force: true })
    cy.wait(250)
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
  })

  it('A new mission with control and surveillance can be closed with all required values When auto-save is disabled (because of old mission)', () => {
    // Given
    cy.get('*[data-cy="add-mission"]').click()
    cy.wait(500)
    cy.wait(500)
    cy.clickButton('Clôturer')
    cy.wait(500)

    cy.get('*[data-cy="mission-errors"]').should('exist')
    cy.contains('Date de fin requise').should('exist')
    cy.contains('Type de mission').should('exist')
    cy.contains('Administration requise').should('exist')
    cy.contains('Unité requise').should('exist')
    cy.contains("Trigramme d'ouverture requis").should('exist')
    cy.contains('Trigramme de clôture requis').should('exist')

    // we fill all the required inputs
    cy.fill('Début de mission (UTC)', [2023, 10, 11, 7, 35])
    cy.wait(250)
    cy.fill('Fin de mission (UTC)', [2023, 10, 12, 7, 35])
    cy.wait(250)
    cy.fill('Type de mission', ['Air'])
    cy.wait(250)
    cy.get('*[data-cy="add-control-unit"]').click()
    cy.wait(250)
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.wait(250)
    cy.fill("Contact de l'unité 1", 'contact').scrollIntoView()
    cy.wait(250)
    cy.fill('Ouvert par', 'PCF').scrollIntoView()
    cy.wait(500)
    cy.fill('Clôturé par', 'PCF').scrollIntoView()

    cy.get('*[data-cy="mission-errors"]').should('not.exist')

    // we add a control
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')
    cy.wait(250)

    cy.get('*[data-cy="mission-errors"]').should('exist')
    cy.contains('Thème requis').should('exist')
    cy.contains('Sous-thématique requise').should('exist')
    cy.contains('Date requise').should('exist')
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

    cy.fill('Nombre total de contrôles', '2')
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

    cy.get('*[data-cy="mission-errors"]').should('not.exist')

    // we add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.wait(250)

    cy.get('*[data-cy="mission-errors"]').should('exist')

    cy.fill('Thématique de surveillance', 'Rejets illicites')
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-theme-element"]').contains('Jet de déchet').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)

    cy.getDataCy('surveillance-zone-matches-mission').should('have.class', 'rs-checkbox-checked')
    cy.get('*[data-cy="mission-errors"]').should('not.exist')

    // delete theme to test error
    cy.fill('Thématique de surveillance', '')
    cy.wait(250)
    cy.get('*[data-cy="mission-errors"]').should('exist')

    cy.fill('Thématique de surveillance', 'Rejets illicites')
    cy.wait(250)
    // TODO understand why `cy.fill` doesn't work here
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-theme-element"]').contains('Jet de déchet').click({ force: true })
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.wait(250)

    // Then
    cy.intercept('PUT', '/bff/v1/missions').as('createAndCloseMission')
    cy.clickButton('Enregistrer et quitter')

    cy.wait('@createAndCloseMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
  })
})
