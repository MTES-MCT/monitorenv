/// <reference types="cypress" />

import { setGeometry } from 'domain/shared_slices/Draw'

import { createPendingMission } from '../../utils/createPendingMission'
import { getFutureDate } from '../../utils/getFutureDate'

import type { EnvActionControl, EnvActionSurveillance, Infraction } from 'domain/entities/missions'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const dispatch = action => cy.window().its('store').invoke('dispatch', action)

export const surveillanceGeometry: GeoJSON.Geometry = {
  coordinates: [
    [
      [
        [-5.445293386230469, 49.204467319852114],
        [-6.05778117919922, 48.85600950618519],
        [-5.67154308105469, 48.29540491855175],
        [-5.010646779785157, 48.68245162584054],
        [-5.445293386230469, 49.204467319852114]
      ]
    ]
  ],
  type: 'MultiPolygon'
}
context('Side Window > Mission Form > Mission actions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.visit(`/side_window`, {
      onBeforeLoad: () => {
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'true')
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
        Cypress.env('CYPRESS_REPORTING_FORM_AUTO_UPDATE', 'true')
      }
    })
    cy.wait('@getMissions')
  })

  it('An infraction Should be duplicated', () => {
    // Given
    cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('control-form-number-controls').type('{backspace}2')
    cy.getDataCy('infraction-form').should('not.exist')

    // When
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.getDataCy('duplicate-infraction').click({ force: true })
    cy.getDataCy('infraction-form-registrationNumber').should('have.value', 'BALTIK')
    cy.getDataCy('infraction-form-validate').click({ force: true })
    cy.getDataCy('duplicate-infraction').eq(1).should('be.disabled')

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)
      const { infractions }: EnvActionControl = request.body.envActions.find(
        a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807'
      )
      expect(infractions.length).equal(2)
      const duplicatedInfraction = infractions[1]

      expect(duplicatedInfraction?.controlledPersonIdentity).equal('John Doe')
      expect(duplicatedInfraction?.formalNotice).equal('PENDING')
      expect(duplicatedInfraction?.administrativeResponse).equal('PENDING')
      expect(duplicatedInfraction?.infractionType).equal('WITH_REPORT')
      expect(duplicatedInfraction?.natinf?.length).equal(2)
      expect(duplicatedInfraction?.observations).equal("Pas d'observations")
      expect(duplicatedInfraction?.registrationNumber).equal('BALTIK')
      expect(duplicatedInfraction?.vesselSize).equal(45)
      expect(duplicatedInfraction?.vesselType).equal('COMMERCIAL')
      expect(duplicatedInfraction?.nbTarget).equal(1)
      expect(duplicatedInfraction?.id).not.equal(infractions?.[0]?.id)
    })
  })

  it('Save observations in control Actions', () => {
    cy.wait(250)
    cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
    cy.getDataCy('action-card').eq(1).click()

    cy.getDataCy('control-form-observations').contains('RAS')

    // When
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.getDataCy('control-form-observations').type('{backspace}{backspace}{backspace}Une observation importante.', {
      delay: 200,
      force: true
    })

    cy.wait(500)
    // Then
    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          envActions: [
            {
              id: 'b8007c8a-5135-4bc3-816f-c69c7b75d807',
              observations: 'Une observation importante.'
            }
          ]
        }
      },
      5,
      0,
      response => {
        const { observations } = response.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
        expect(observations).equal('Une observation importante.')

        expect(response && response.statusCode).equal(200)
      }
    )
  })

  it('Should retrieve all themes into awareness select field in surveillance actions', () => {
    // Given
    cy.intercept('GET', '/api/v1/themes*').as('getThemes')
    cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
    cy.wait(250)
    cy.getDataCy('action-card').eq(0).click()
    cy.wait(250)
    cy.wait('@getThemes')

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')

    cy.fill('Thématiques et sous-thématiques de surveillance', [
      'Réglementation de la réserve naturelle',
      "Rejet d'hydrocarbure",
      "Découverte d'une épave maritime"
    ])

    cy.fill('La surveillance a donné lieu à des actions de prévention', true)

    cy.getDataCy('surveillance-awareness-select').click({ force: true })

    cy.getDataCy('surveillance-awareness-fields').within(() => {
      cy.get('div[role="option"]').then(options => {
        const actual = [...options].map(option => option.textContent)
        expect(actual).to.deep.eq(['Épave', 'Rejet', 'Réserve naturelle'])
      })
      cy.get('div[role="option"]').contains('Épave').click() // id 105
      cy.fill('Nb de personnes informées', 5)
    })

    // Then
    cy.waitForLastRequest(
      '@updateMission',
      { body: { envActions: [{ awareness: { isRisingAwareness: true, nbPerson: 5, themeId: 105 } }] } },
      10,
      0,
      response => {
        expect(response && response.statusCode).equal(200)

        const { awareness }: EnvActionSurveillance =
          response && response.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
        expect(awareness?.isRisingAwareness).equal(true)
        expect(awareness?.nbPerson).equal(5)
        expect(awareness?.themeId).equal(105)
      }
    )
  })

  it('Should duplicate control and surveillance', () => {
    cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })

    cy.getDataCy('action-card').eq(1).click()
    cy.get('input[name="isControlAttachedToReporting"]').should('be.checked')

    cy.clickButton('Dupliquer le contrôle')
    // The duplicate control should be the "active" action and attached reporting should be removed
    cy.get('input[name="isControlAttachedToReporting"]').should('be.not.checked')
    cy.clickButton('Supprimer le contrôle')

    // Attach reporting to surveillance
    cy.wait(250)
    cy.getDataCy('action-card').eq(0).click()
    cy.getDataCy('surveillance-form-toggle-reporting').click({ force: true })
    cy.fill('Signalements', ['6'])
    cy.wait(250)
    // duplicate surveillance from timeline
    cy.clickButton("Dupliquer l'action")
    cy.wait(500)
    cy.getDataCy('action-card').eq(0).click()
    // The duplicate surveillance should be the "active" action and attached reporting should be removed
    cy.get('input[name="isSurveillanceAttachedToReporting"]').should('be.not.checked')
    // The duplicate control should be the "active" action and attached reporting should be removed
    cy.get('input[name="isSurveillanceAttachedToReporting"]').should('be.not.checked')
    cy.clickButton('Supprimer la surveillance')

    cy.getDataCy('action-card').eq(0).click()
    cy.getDataCy('surveillance-form-toggle-reporting').click({ force: true })
  })

  it(`Should be able to delete action with linked reporting`, () => {
    // Given
    cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
    cy.wait(500)
    cy.getDataCy('action-card').eq(0).click()

    cy.wait(500)
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.getDataCy('actioncard-delete-button-b8007c8a-5135-4bc3-816f-c69c7b75d807').click()

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)

      const { envActions } = response && response.body
      expect(envActions.length).equal(1)
    })
  })

  it(`Should create and save a note`, () => {
    // Given
    cy.wait(400)

    cy.clickButton('Ajouter une nouvelle mission')

    // When
    const endDate = getFutureDate(7, 'day')
    cy.fill('Date de fin (UTC)', endDate)
    cy.get('[name="missionTypes0"]').click({ force: true })

    cy.fill('Unité 1', 'Brigade fluviale de Rouen')
    cy.wait(250)

    // Add a note
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une note libre')
    cy.wait(500)
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    cy.get('[id="envActions[0].observations"]').type('Obs.', {
      force: true
    })
    cy.wait(250)
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.envActions[0].observations).equal('Obs.')
      const id = response && response.body.id

      // clean
      cy.wait(250)
      cy.clickButton('Fermer')
      cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
      cy.wait('@getMissions')
      cy.getDataCy(`edit-mission-${id}`).click({ force: true })
      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })

  it('Save observations in surveillance Actions', () => {
    // Given
    cy.clickButton('Ajouter une nouvelle mission')

    // When
    const endDate = getFutureDate(7, 'day')
    cy.fill('Date de fin (UTC)', endDate)
    cy.get('[name="missionTypes0"]').click({ force: true })

    cy.fill('Unité 1', 'Brigade fluviale de Rouen')
    cy.wait(250)
    cy.getDataCy('control-unit-contact').type('Contact 012345')
    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.wait(250)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.wait(500)
    cy.clickButton('Ajouter une zone de surveillance')
    dispatch(setGeometry(surveillanceGeometry))
    cy.get('[id="envActions[0].observations"]').type('Obs.', {
      force: true
    })

    cy.getDataCy('surveillance-open-by').type('ABC')
    cy.getDataCy('surveillance-completed-by').type('ABC')

    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')

    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.envActions[0].observations).equal('Obs.')

      const id = response && response.body.id

      // clean
      cy.wait(250)
      cy.clickButton('Fermer')
      cy.getDataCy(`edit-mission-${id}`).click({ force: true })
      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })

  it('Should create surveillance and control actions with valid themes and subthemes depending on mission year', () => {
    // Given
    cy.clickButton('Ajouter une nouvelle mission')

    // When
    const endDate = getFutureDate(7, 'day')
    cy.fill('Date de fin (UTC)', endDate)

    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.fill('Unité 1', 'Brigade fluviale de Rouen')

    cy.wait(250)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.clickButton('Ajouter une zone de surveillance')
    dispatch(setGeometry(surveillanceGeometry))

    cy.getDataCy('action-missing-fields-text').contains('3 champs nécessaires aux statistiques à compléter')

    // select sub-theme and tags
    cy.fill('Thématiques et sous-thématiques de surveillance', ['Autre (Épave)'])
    cy.fill('Tags et sous-tags', ['Mixte'])
    cy.getDataCy('surveillance-open-by').type('ABC', { force: true })
    cy.getDataCy('surveillance-completed-by').type('ABC', { force: true })

    // All fields are filled
    cy.getDataCy('action-all-fields-are-filled-text').should('exist')
    cy.getDataCy('action-all-fields-completed').should('exist')

    // Add a control
    cy.clickButton('Ajouter')
    cy.wait(500)
    cy.clickButton('Ajouter des contrôles')
    cy.getDataCy('action-missing-fields-text').contains('6 champs nécessaires aux statistiques à compléter')
    cy.clickButton('Ajouter un point de contrôle')
    cy.wait(200)

    const controlGeometry: GeoJSON.Geometry = {
      coordinates: [[-1.84589767, 46.66739394]],
      type: 'MultiPoint'
    }
    dispatch(setGeometry(controlGeometry))

    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')

    cy.fill('Thématiques et sous-thématiques de contrôle', ['Pêche embarquée'])
    cy.fill('Tags et sous-tags', ['Mixte'])

    cy.getDataCy('control-open-by').scrollIntoView().type('ABC', { force: true })
    cy.getDataCy('control-completed-by').scrollIntoView().type('ABC', { force: true })
    cy.getDataCy('action-missing-fields-text').contains('4 champs nécessaires aux statistiques à compléter')

    cy.wait(250)
    // Then
    cy.waitForLastRequest('@updateMission', {}, 5, 0, response => {
      expect(response && response.statusCode).equal(200)
      const { envActions } = response && response.body
      expect(envActions.length).equal(2)
      // control
      const control = envActions.find(a => a.actionType === 'CONTROL')
      const themes = control.themes[0]
      expect(themes.id).equal(112)
      expect(themes.subThemes.length).equal(1)
      expect(themes.subThemes[0]?.id).equal(332)
      const tags = control.tags[0]
      expect(tags.id).equal(4)
      expect(tags.subTags.length).equal(0)

      // surveillance
      const surveillance: EnvActionSurveillance = envActions.find(a => a.actionType === 'SURVEILLANCE')
      const surveillanceThemes = surveillance.themes?.[0]
      expect(surveillanceThemes?.id).equal(105)
      expect(surveillanceThemes?.subThemes?.length).equal(1)
      expect(surveillanceThemes?.subThemes[0]?.id).equal(286)
      const surveillanceTags = control.tags[0]
      expect(surveillanceTags.id).equal(4)
      expect(surveillanceTags.subTags.length).equal(0)

      const id = response && response.body.id
      // update mission date to 2023
      cy.fill('Date de début (UTC)', [2023, 5, 26, 12, 0], { delay: 400 })
      cy.intercept('PUT', `/bff/v1/missions/${id}`).as('updateMissionTwo')
      cy.fill('Date de fin (UTC)', [2023, 5, 28, 14, 15])

      cy.getDataCy('completion-mission-status-tag-to-completed-mission-ended').should('exist')

      // check if themes in control has been reset
      cy.wait(250)
      cy.getDataCy('action-card').eq(0).click()
      cy.getDataCy('action-missing-fields-text').contains('5 champs nécessaires aux statistiques à compléter')

      // check if themes in surveillance has been reset
      cy.wait(250)
      cy.getDataCy('action-card').eq(1).click()
      cy.getDataCy('action-missing-fields-text').contains('1 champ nécessaire aux statistiques à compléter')

      // delete created mission
      cy.clickButton('Supprimer la mission')
      cy.wait(400)
      cy.get('*[name="delete-mission-modal-confirm').click()
    })
  })

  it('Save other control actions', () => {
    cy.getDataCy('edit-mission-41').scrollIntoView().click({ force: true })
    cy.getDataCy('action-card').eq(0).click()

    cy.intercept('PUT', '/bff/v1/missions/41').as('updateMission')

    // verify if fields are checked
    cy.get('*[name="envActions[0].isAdministrativeControl').scrollIntoView().should('be.checked')
    cy.get('*[name="envActions[0].isComplianceWithWaterRegulationsControl').should('be.checked')
    cy.get('*[name="envActions[0].isSafetyEquipmentAndStandardsComplianceControl').should('be.checked')
    cy.get('*[name="envActions[0].isSeafarersControl').should('be.checked')

    // uncheck all fields
    cy.fill('Contrôle administratif', false)
    cy.fill('Respect du code de la navigation sur le plan d’eau', false)
    cy.fill('Gens de mer', false)
    cy.fill('Equipement de sécurité et respect des normes', false)
    cy.wait(200)

    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          envActions: [
            {
              isAdministrativeControl: false,
              isComplianceWithWaterRegulationsControl: false,
              isSafetyEquipmentAndStandardsComplianceControl: false,
              isSeafarersControl: false
            }
          ]
        }
      },
      6,
      0,
      response => {
        expect(response && response.statusCode).equal(200)

        const controlActionResponse: EnvActionControl = response?.body.envActions[0]
        expect(controlActionResponse.isAdministrativeControl).equal(false)
        expect(controlActionResponse.isComplianceWithWaterRegulationsControl).equal(false)
        expect(controlActionResponse.isSafetyEquipmentAndStandardsComplianceControl).equal(false)
        expect(controlActionResponse.isSeafarersControl).equal(false)
        cy.log('controlActionResponse', controlActionResponse)

        cy.clickButton('Fermer')
        cy.getDataCy('edit-mission-41').scrollIntoView().click({ force: true })
        cy.getDataCy('action-card').eq(0).click()
        cy.fill('Contrôle administratif', true)
        cy.wait(200)
        cy.fill('Respect du code de la navigation sur le plan d’eau', true)
        cy.wait(200)
        cy.fill('Gens de mer', true)
        cy.wait(200)
        cy.fill('Equipement de sécurité et respect des normes', true)
      }
    )
  })

  it('Should display CNSP actions', () => {
    cy.getDataCy('edit-mission-53').scrollIntoView().click({ force: true })
    cy.getDataCy('cnsp-action-text').should('have.length', 5)
  })

  it("Should display warning banner if fish api doesn't respond", () => {
    cy.fill('Période', 'Un mois')
    cy.wait('@getMissions')
    cy.get('.Table-SimpleTable').scrollIntoView({ offset: { left: 0, top: 800 } })
    cy.getDataCy('edit-mission-27')
      .scrollIntoView({ offset: { left: 300, top: -100 } })
      .click({ force: true })
    cy.getDataCy('side-window-banner-stack').contains(
      "Problème de communication avec MonitorFish ou RapportNav: impossible de récupérer les événements du CNSP ou de l'unité"
    )
  })

  it('Should save infraction with vessel type is "VESSEL"', () => {
    createPendingMission().then(({ body }) => {
      const mission = body

      cy.intercept('PUT', `/bff/v1/missions/${mission.id}`).as('updateMission')

      // Add a control
      cy.clickButton('Ajouter')
      cy.clickButton('Ajouter des contrôles')
      cy.wait(500)

      cy.fill('Nb total de contrôles', 2)
      cy.fill('Type de cible', 'Véhicule')
      cy.fill('Type de véhicule', 'Navire')

      cy.clickButton('+ Ajouter un contrôle avec infraction')
      cy.fill('MMSI', '123456789')
      cy.fill('Nom du navire', 'BALTIK')
      cy.fill('IMO', 'IMO123')
      cy.fill('Nom du capitaine', 'John Doe')
      cy.fill('Immatriculation', 'ABC123')
      cy.fill('Taille', 45)
      cy.fill('Type de navire', 'Commerce')
      cy.fill("Type d'infraction", 'Avec PV')
      cy.fill('Réponse administrative', 'Sanction')
      cy.fill('Appréhension/saisie', 'Oui')
      cy.fill('Mise en demeure', 'Oui')
      cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])
      cy.fill('Nb de cibles avec cette infraction', 1)

      cy.getDataCy('control-open-by').type('ABC')
      cy.wait(250)

      cy.wait('@updateMission').then(({ request, response }) => {
        // check request
        const requestInfraction: Infraction = request.body.envActions[0].infractions[0]
        expect(requestInfraction.mmsi).equal('123456789')
        expect(requestInfraction.vesselName).equal('BALTIK')
        expect(requestInfraction.imo).equal('IMO123')
        expect(requestInfraction.controlledPersonIdentity).equal('John Doe')
        expect(requestInfraction.registrationNumber).equal('ABC123')
        expect(requestInfraction.vesselSize).equal(45)
        expect(requestInfraction.vesselType).equal('COMMERCIAL')
        expect(requestInfraction.infractionType).equal('WITH_REPORT')
        expect(requestInfraction.administrativeResponse).equal('SANCTION')
        expect(requestInfraction.seizure).equal('YES')
        expect(requestInfraction.formalNotice).equal('YES')
        expect(requestInfraction.natinf).to.deep.equal(['1508'])
        expect(requestInfraction.nbTarget).equal(1)

        // check response
        const responseInfraction = response?.body.envActions[0].infractions[0]
        expect(response && response.statusCode).equal(200)
        expect(responseInfraction.mmsi).equal('123456789')
        expect(responseInfraction.vesselName).equal('BALTIK')
        expect(responseInfraction.imo).equal('IMO123')
        expect(responseInfraction.controlledPersonIdentity).equal('John Doe')
        expect(responseInfraction.registrationNumber).equal('ABC123')
        expect(responseInfraction.vesselSize).equal(45)
        expect(responseInfraction.vesselType).equal('COMMERCIAL')
        expect(requestInfraction.infractionType).equal('WITH_REPORT')
        expect(requestInfraction.administrativeResponse).equal('SANCTION')
        expect(requestInfraction.formalNotice).equal('YES')
        expect(requestInfraction.natinf).to.deep.equal(['1508'])
        expect(requestInfraction.nbTarget).equal(1)

        // clean
        cy.wait(250)
        cy.clickButton('Fermer')
        cy.getDataCy(`edit-mission-${mission.id}`).click({ force: true })
        cy.clickButton('Supprimer la mission')
        cy.clickButton('Confirmer la suppression')
      })
    })
  })

  it('Should display target type if there are no identity informations when adding an infraction', () => {
    createPendingMission().then(({ body }) => {
      const mission = body

      cy.intercept('PUT', `/bff/v1/missions/${mission.id}`).as('updateMission')

      // Add a control
      cy.clickButton('Ajouter')
      cy.clickButton('Ajouter des contrôles')
      cy.wait(500)

      cy.fill('Nb total de contrôles', 1)
      cy.fill('Type de cible', 'Personne morale')
      cy.clickButton('+ Ajouter un contrôle avec infraction')
      // Fill mandatory fields
      cy.fill("Type d'infraction", 'Avec PV')
      cy.fill('Réponse administrative', 'Sanction')
      cy.fill('Mise en demeure', 'Oui')
      cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])
      cy.clickButton("Valider l'infraction")

      // cases without identification
      cy.getDataCy('infraction-0-identification').contains('1 personne morale')

      cy.fill('Type de cible', 'Personne physique')
      cy.getDataCy('infraction-0-identification').contains('1 personne physique')

      cy.fill('Type de cible', 'Véhicule')
      cy.getDataCy('infraction-0-identification').contains('1 véhicule - Type non renseigné')

      cy.fill('Type de véhicule', 'Navire')
      cy.getDataCy('infraction-0-identification').contains('1 véhicule - Navire')

      // cases with identification
      // Company
      cy.fill('Type de cible', 'Personne morale')
      cy.clickButton("Modifier l'infraction")
      cy.fill('Identité de la personne contrôlée', 'John Doe')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('John Doe')

      cy.clickButton("Modifier l'infraction")
      cy.fill('Nom de la personne morale', 'World company')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('World company - John Doe')

      // Individual
      cy.fill('Type de cible', 'Personne physique')
      cy.getDataCy('infraction-0-identification').contains('John Doe')

      // Vehicle
      cy.fill('Type de cible', 'Véhicule')
      cy.fill('Type de véhicule', 'Navire')

      cy.clickButton("Modifier l'infraction")
      cy.fill('Immatriculation', 'ABC123')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('ABC123')

      cy.clickButton("Modifier l'infraction")
      cy.fill('IMO', 'IMO123')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('IMO123')

      cy.clickButton("Modifier l'infraction")
      cy.fill('MMSI', '123456789')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('123456789')

      cy.clickButton("Modifier l'infraction")
      cy.fill('Nom du navire', 'Le hollandais volant')
      cy.fill('Taille', 16)
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('Le hollandais volant - 123456789 - 16')

      cy.fill('Type de véhicule', 'Autre véhicule marin')
      cy.getDataCy('infraction-0-identification').contains('ABC123')

      // delete created mission
      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })

  it('Should display number of infraction target and target type', () => {
    createPendingMission().then(({ body }) => {
      const mission = body

      cy.intercept('PUT', `/bff/v1/missions/${mission.id}`).as('updateMission')

      // Add a control
      cy.clickButton('Ajouter')
      cy.clickButton('Ajouter des contrôles')
      cy.wait(500)

      cy.fill('Nb total de contrôles', 10)
      cy.fill('Type de cible', 'Personne morale')
      cy.clickButton('+ Ajouter un contrôle avec infraction')
      // Fill mandatory fields
      cy.fill("Type d'infraction", 'Avec PV')
      cy.fill('Mise en demeure', 'Oui')
      cy.fill('Appréhension/saisie', 'Oui')
      cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])
      cy.fill('Réponse administrative', 'Régularisation')
      cy.fill('Nb de cibles avec cette infraction', 2)
      cy.clickButton("Valider l'infraction")

      cy.getDataCy('mission-timeline-infractions-tags')
        .children('.Element-Tag')
        .each(($el, index) => {
          cy.wrap($el)
            .invoke('text')
            .then(text => {
              switch (index) {
                case 0:
                  expect(text).to.equal('8 RAS')
                  break
                case 1:
                  expect(text).to.equal('2 PV')
                  break
                case 2:
                  expect(text).to.equal('2 MED')
                  break
                case 3:
                  expect(text).to.equal('2 RÉGUL. ADMIN')
                  break
                case 4:
                  expect(text).to.equal('2 APPR./SAISIE')
                  break
                default:
                  break
              }
            })
        })

      // cases without identification
      cy.getDataCy('infraction-0-identification').contains('2 personnes morales')

      cy.fill('Type de cible', 'Personne physique')
      cy.getDataCy('infraction-0-identification').contains('2 personnes physiques')

      cy.fill('Type de cible', 'Véhicule')
      cy.getDataCy('infraction-0-identification').contains('2 véhicules')

      // delete created mission
      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })

  it('Should keep pending action when switching tabs', () => {
    createPendingMission().then(() => {
      // Add a control
      cy.clickButton('Ajouter')
      cy.clickButton('Ajouter des contrôles')
      cy.wait(500)

      cy.fill('Nb total de contrôles', 1)

      cy.fill('Type de cible', 'Véhicule')
      cy.fill('Type de véhicule', 'Autre véhicule marin')

      // update target type and check if vehicle type is cleaned
      cy.fill('Type de cible', 'Personne morale')
      cy.get('input[name="envActions.0.vehicleType"]').should('have.value', '')

      // re add vehicle type
      cy.fill('Type de cible', 'Véhicule')
      cy.fill('Type de véhicule', 'Navire')

      cy.clickButton('+ Ajouter un contrôle avec infraction')
      cy.fill('MMSI', '123456789')
      cy.fill('Nom du navire', 'BALTIK')
      cy.fill('IMO', 'IMO123')
      cy.fill('Nom du capitaine', 'John Doe')
      cy.clickOutside()

      cy.getDataCy('mission-0').first().click({ force: true })
      cy.getDataCy('mission-1').first().click({ force: true })
      cy.get('input[name="envActions[0].infractions[0].mmsi"]').should('have.value', '123456789')
      cy.get('input[name="envActions[0].infractions[0].vesselName"]').should('have.value', 'BALTIK')
      cy.get('input[name="envActions[0].infractions[0].imo"]').should('have.value', 'IMO123')
      cy.get('input[name="envActions[0].infractions[0].controlledPersonIdentity"]').should('have.value', 'John Doe')

      // delete created mission
      cy.clickButton('Supprimer la mission')
      cy.clickButton('Confirmer la suppression')
    })
  })
})
