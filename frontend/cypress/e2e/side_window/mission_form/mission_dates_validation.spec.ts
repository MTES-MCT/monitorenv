/// <reference types="cypress" />

context('Side Window > Mission Form > Mission dates', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad: () => {
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'true')
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
      }
    })
  })

  it('A mission should be created with surveillances and valid dates', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="add-mission"]').click()

    // When
    cy.fill('Date de début (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Date de fin (UTC)', [2024, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.fill('Unité 1', 'Cross Gris Nez', { delay: 100 })
    cy.wait(250)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Gris Nez')

    cy.wait(500)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.getDataCy('surveillance-open-by').type('ABC')
    cy.get('*[data-cy="envaction-theme-selector"]').click()
    cy.get('*[data-cy="envaction-theme-element"]').contains('Espèce protégée').click()
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Destruction').click({ force: true })
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })

    cy.getDataCy('surveillance-duration-matches-mission').should('have.class', 'rs-checkbox-checked')
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Jour"]')
      .invoke('val')
      .then(surveillanceStartDay => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Jour"]')
          .invoke('val')
          .should('eq', surveillanceStartDay)
      })
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Mois"]')
      .invoke('val')
      .then(surveillanceStartMonth => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Mois"]')
          .invoke('val')
          .should('eq', surveillanceStartMonth)
      })
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Année"]')
      .invoke('val')
      .then(surveillanceStartYear => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Année"]')
          .invoke('val')
          .should('eq', surveillanceStartYear)
      })
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Heure"]')
      .invoke('val')
      .then(surveillanceStartHour => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Heure"]')
          .invoke('val')
          .should('eq', surveillanceStartHour)
      })
    cy.get('*[data-cy="surveillance-start-date-time"]')
      .find('[aria-label="Minute"]')
      .invoke('val')
      .then(surveillanceStartMinute => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Minute"]')
          .invoke('val')
          .should('eq', surveillanceStartMinute)
      })

    // Add a second surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')

    cy.getDataCy('surveillance-open-by').type('ABC')
    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Mouillage individuel').click()
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Autre').click({ force: true })
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Drone').click({ force: true })
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })

    cy.getDataCy('action-card').eq(0).click()
    cy.getDataCy('surveillance-duration-matches-mission').should('not.have.class', 'rs-checkbox-checked')

    // Start date of surveillance is before start date of mission
    cy.fill('Date et heure de début de surveillance', [2024, 5, 25, 23, 35])
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de début doit être postérieure à celle de début de mission')

    // Start date of surveillance is after end date of mission
    cy.fill('Date et heure de début de surveillance', [2024, 5, 28, 15, 35])
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de début doit être antérieure à celle de fin de mission')

    // Valid start date of surveillance
    cy.fill('Date et heure de début de surveillance', [2024, 5, 26, 23, 35])

    // End date of surveillance is before start date of mission
    cy.fill('Date et heure de fin de surveillance', [2024, 5, 25, 23, 35])
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de fin doit être postérieure à celle de début de mission')

    // End date of surveillance is after end date of mission
    cy.fill('Date et heure de fin de surveillance', [2024, 5, 28, 15, 35])
    cy.wait(250)
    cy.get('.Element-FieldError').contains('La date de fin doit être antérieure à celle de fin de mission')

    // Valid end date of surveillance
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    cy.fill('Date et heure de fin de surveillance', [2024, 5, 28, 13, 35])

    // Then
    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          endDateTimeUtc: '2024-05-28T14:15:00Z',
          envActions: [
            {
              actionEndDateTimeUtc: '2024-05-28T13:35:00.000Z',
              actionStartDateTimeUtc: '2024-05-26T23:35:00.000Z'
            },
            {
              actionEndDateTimeUtc: '2024-05-28T14:15:00Z',
              actionStartDateTimeUtc: '2024-05-26T12:00:00Z'
            }
          ],
          startDateTimeUtc: '2024-05-26T12:00:00Z'
        }
      },
      5,
      0,
      response => {
        if (!response) {
          return
        }
        expect(response.statusCode).equal(200)
        const id = response.body.id
        cy.clickButton('Fermer')

        // clean
        cy.getDataCy(`edit-mission-${id}`).scrollIntoView().click({ force: true })
        cy.getDataCy('action-card').eq(0).click()
        cy.clickButton('Supprimer la mission')
        cy.clickButton('Confirmer la suppression')
      }
    )
  })

  it('A mission should be created with same surveillance and mission dates', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="add-mission"]').click()

    // When
    cy.fill('Date de début (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Date de fin (UTC)', [2024, 5, 28, 14, 15])

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.fill('Unité 1', 'DF 61 Port-de-Bouc', { delay: 100 })
    cy.clickOutside()
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('Douane')
    cy.get('*[data-cy="add-control-unit"]').contains('DF 61 Port-de-Bouc')
    cy.wait(200)

    cy.intercept('PUT', `/bff/v1/missions/*`).as('updateMission')

    // Add a surveillance
    cy.wait(200)
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')

    cy.getDataCy('surveillance-open-by').type('ABC')
    cy.getDataCy('surveillance-duration-matches-mission').should('have.class', 'rs-checkbox-checked')

    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          endDateTimeUtc: '2024-05-28T14:15:00Z',
          envActions: [
            {
              actionEndDateTimeUtc: '2024-05-28T14:15:00Z',
              actionStartDateTimeUtc: '2024-05-26T12:00:00Z'
            }
          ],
          startDateTimeUtc: '2024-05-26T12:00:00Z'
        }
      },
      5,
      0,
      response => {
        expect(response.statusCode).equal(200)
        const id = response.body.id
        cy.clickButton('Fermer')

        // clean
        cy.getDataCy(`edit-mission-${id}`).click({ force: true })
        cy.getDataCy('action-card').eq(0).click()
        cy.getDataCy('surveillance-duration-matches-mission').should('have.class', 'rs-checkbox-checked')
        cy.clickButton('Supprimer la mission')
        cy.clickButton('Confirmer la suppression')
      }
    )
  })

  it('A mission should be created with valid dates for control action', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="add-mission"]').click()

    // When
    cy.fill('Date de début (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Date de fin (UTC)', [2024, 5, 28, 14, 15])

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.fill('Unité 1', 'Cultures marines – DDTM 40', { delay: 100 })
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DDTM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cultures marines – DDTM 40')

    cy.wait(250)

    // Add a control
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')

    cy.getDataCy('control-open-by').scrollIntoView().type('ABC')
    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Espèce protégée').click()
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Détention').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').click('topLeft')
    cy.get('*[data-cy="envaction-subtheme-selector"]').click('topLeft', { force: true })

    cy.get('*[data-cy="control-form-number-controls"]').type('{backspace}2')
    cy.fill('Type de cible', 'Personne morale')

    // Date is before start date of mission
    cy.fill('Date et heure du contrôle (UTC)', [2024, 5, 25, 23, 35])
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date doit être postérieure à celle de début de mission')

    // Date is after end date of mission
    cy.fill('Date et heure du contrôle (UTC)', [2024, 5, 28, 14, 16])
    cy.wait(250)
    cy.get('.Element-FieldError').contains('La date doit être antérieure à celle de fin de mission')

    // Valid date
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    cy.fill('Date et heure du contrôle (UTC)', [2024, 5, 28, 13, 16])

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      if (!response) {
        return
      }

      expect(response && response.statusCode).equal(200)
      const missionId = response.body.id
      cy.clickButton('Fermer')

      cy.getDataCy(`edit-mission-${missionId}`).click({ force: true })
      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })
})
