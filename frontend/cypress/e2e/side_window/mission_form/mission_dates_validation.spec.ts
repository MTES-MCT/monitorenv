/// <reference types="cypress" />

import { getFutureDate } from '../../utils/getFutureDate'
import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'

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
    cy.getDataCy('add-mission').click()

    // When
    const { asApiDateTime, asDatePickerDateTime } = getUtcDateInMultipleFormats()
    cy.fill('Date de début (UTC)', asDatePickerDateTime)
    const missionEndDate = getFutureDate(7, 'day')
    cy.fill('Date de fin (UTC)', missionEndDate)
    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.fill('Unité 1', 'Cross Etel', { delay: 100 })
    cy.wait(250)
    cy.getDataCy('add-control-administration').contains('DIRM / DM')
    cy.getDataCy('add-control-unit').contains('Cross Etel')

    cy.wait(500)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.getDataCy('envaction-theme-selector').click()
    cy.getDataCy('envaction-theme-element').contains('Espèce protégée').click()
    cy.getDataCy('envaction-subtheme-selector').click({ force: true })
    cy.getDataCy('envaction-theme-element').contains('Destruction').click({ force: true })
    cy.getDataCy('envaction-subtheme-selector').click('topLeft', { force: true })

    cy.getDataCy('surveillance-open-by').type('ABC', { force: true })
    cy.wait(250)

    cy.getDataCy('surveillance-duration-matches-mission').should('have.class', 'rs-checkbox-checked')
    cy.getDataCy('surveillance-start-date-time')
      .find('[aria-label="Jour"]')
      .invoke('val')
      .then(surveillanceStartDay => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Jour"]')
          .invoke('val')
          .should('eq', surveillanceStartDay)
      })
    cy.getDataCy('surveillance-start-date-time')
      .find('[aria-label="Mois"]')
      .invoke('val')
      .then(surveillanceStartMonth => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Mois"]')
          .invoke('val')
          .should('eq', surveillanceStartMonth)
      })
    cy.getDataCy('surveillance-start-date-time')
      .find('[aria-label="Année"]')
      .invoke('val')
      .then(surveillanceStartYear => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Année"]')
          .invoke('val')
          .should('eq', surveillanceStartYear)
      })
    cy.getDataCy('surveillance-start-date-time')
      .find('[aria-label="Heure"]')
      .invoke('val')
      .then(surveillanceStartHour => {
        cy.getDataCy('mission-start-date-time')
          .find('[aria-label="Heure"]')
          .invoke('val')
          .should('eq', surveillanceStartHour)
      })
    cy.getDataCy('surveillance-start-date-time')
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

    cy.getDataCy('envaction-theme-selector').click({ force: true })
    cy.getDataCy('envaction-theme-element').contains('Mouillage individuel').click()
    cy.getDataCy('envaction-subtheme-selector').click({ force: true })
    cy.getDataCy('envaction-theme-element').contains('Autre').click({ force: true })
    cy.getDataCy('envaction-subtheme-selector').click('topLeft', { force: true })
    cy.getDataCy('envaction-theme-element').contains('Drone').click({ force: true })
    cy.getDataCy('envaction-subtheme-selector').click('topLeft', { force: true })

    cy.getDataCy('surveillance-duration-matches-mission').should('not.have.class', 'rs-checkbox-checked')

    cy.getDataCy('surveillance-open-by').type('ABC', { force: true })
    cy.wait(250)

    const dateBeforeStartDateMissionInString = getUtcDateInMultipleFormats()
      .asDayjsUtcDate.subtract(5, 'day')
      .toISOString()
    const dateBeforeStartDateMission = getUtcDateInMultipleFormats(
      dateBeforeStartDateMissionInString
    ).asDatePickerDateTime

    const dateAfterEndDateMission = getFutureDate(10, 'day')

    // Start date of surveillance is before start date of mission
    cy.fill('Date et heure de début de surveillance', dateBeforeStartDateMission)
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de début doit être postérieure à celle de début de mission')
    cy.wait(200)

    // Start date of surveillance is after end date of mission
    cy.fill('Date et heure de début de surveillance', dateAfterEndDateMission)
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de début doit être antérieure à celle de fin de mission')
    cy.wait(200)

    // Valid start date of surveillance
    const validSurveillanceStartDate = getFutureDate(1, 'day')
    cy.fill('Date et heure de début de surveillance', validSurveillanceStartDate)

    // End date of surveillance is before start date of mission
    cy.fill('Date et heure de fin de surveillance', dateBeforeStartDateMission)
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de fin doit être postérieure à celle de début de mission')
    cy.wait(200)

    // End date of surveillance is after end date of mission
    cy.fill('Date et heure de fin de surveillance', dateAfterEndDateMission)
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de fin doit être antérieure à celle de fin de mission')
    cy.wait(200)

    // Valid end date of surveillance
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    const validSurveillanceEndDate = getFutureDate(4, 'day')
    cy.fill('Date et heure de fin de surveillance', validSurveillanceEndDate)
    cy.wait(250)

    // Then
    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          startDateTimeUtc: `${asApiDateTime}:00Z`
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
    cy.getDataCy('add-mission').click()

    // When
    const { asApiDateTime, asDatePickerDateTime } = getUtcDateInMultipleFormats()
    cy.fill('Date de début (UTC)', asDatePickerDateTime)
    const endDate = getFutureDate(7, 'day')
    cy.fill('Date de fin (UTC)', endDate)

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.fill('Unité 1', 'DF 25 Libecciu', { delay: 100 })
    cy.clickOutside()
    cy.wait(200)
    cy.getDataCy('add-control-administration').contains('Douane')
    cy.getDataCy('add-control-unit').contains('DF 25 Libecciu')
    cy.wait(200)

    cy.intercept('PUT', `/bff/v1/missions/*`).as('updateMission')

    // Add a surveillance
    cy.wait(200)
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')

    cy.getDataCy('surveillance-open-by').type('ABC', { force: true })
    cy.getDataCy('surveillance-duration-matches-mission').should('have.class', 'rs-checkbox-checked')

    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          startDateTimeUtc: `${asApiDateTime}:00Z`
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
    cy.getDataCy('add-mission').click()

    // When
    const endDate = getFutureDate(7, 'day')
    cy.fill('Date de fin (UTC)', endDate)

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.fill('Unité 1', 'DF 61 Port-de-Bouc', { delay: 100 })
    cy.wait(200)
    cy.getDataCy('add-control-administration').contains('Douane')
    cy.getDataCy('add-control-unit').contains('DF 61 Port-de-Bouc')

    cy.wait(250)

    // Add a control
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')

    cy.getDataCy('control-open-by').scrollIntoView().type('ABC', { force: true })
    cy.wait(250)

    cy.getDataCy('envaction-theme-selector').click({ force: true })
    cy.getDataCy('envaction-theme-element').contains('Espèce protégée').click()
    cy.getDataCy('envaction-subtheme-selector').click({ force: true })
    cy.getDataCy('envaction-theme-element').contains('Détention').click({ force: true })
    cy.getDataCy('envaction-theme-element').click('topLeft')
    cy.getDataCy('envaction-subtheme-selector').click('topLeft', { force: true })

    cy.getDataCy('control-form-number-controls').type('{backspace}2')
    cy.fill('Type de cible', 'Personne morale')

    const dateBeforeStartDateMissionInString = getUtcDateInMultipleFormats()
      .asDayjsUtcDate.subtract(5, 'day')
      .toISOString()
    const dateBeforeStartDateMission = getUtcDateInMultipleFormats(
      dateBeforeStartDateMissionInString
    ).asDatePickerDateTime

    const dateAfterEndDateMission = getFutureDate(10, 'day')

    // Date is before start date of mission
    cy.fill('Date et heure du contrôle (UTC)', dateBeforeStartDateMission)
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date doit être postérieure à celle de début de mission')

    // Date is after end date of mission
    cy.fill('Date et heure du contrôle (UTC)', dateAfterEndDateMission)
    cy.wait(250)
    cy.get('.Element-FieldError').contains('La date doit être antérieure à celle de fin de mission')

    // Valid date
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    const controlEndDate = getFutureDate(5, 'day')
    cy.fill('Date et heure du contrôle (UTC)', controlEndDate)

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
