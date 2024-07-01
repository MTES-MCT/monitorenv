/// <reference types="cypress" />

import { createPendingMission } from '../../utils/createPendingMission'
import { getFutureDate } from '../../utils/getFutureDate'

context('Side Window > Mission Form > Mission actions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad: () => {
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'true')
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
      }
    })
  })

  it('An infraction Should be duplicated', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').scrollIntoView().click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('*[data-cy="control-form-number-controls"]').type('{backspace}2')
    cy.get('*[data-cy="infraction-form"]').should('not.exist')

    // When
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('*[data-cy="duplicate-infraction"]').click({ force: true })
    cy.get('*[data-cy="infraction-form-registrationNumber"]').should('have.value', 'BALTIK')
    cy.get('*[data-cy="infraction-form-validate"]').click({ force: true })
    cy.get('*[data-cy="duplicate-infraction"]').eq(1).should('be.disabled')

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)
      const { infractions } = request.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
      expect(infractions.length).equal(2)
      const duplicatedInfraction = infractions[1]

      expect(duplicatedInfraction.controlledPersonIdentity).equal('John Doe')
      expect(duplicatedInfraction.formalNotice).equal('PENDING')
      expect(duplicatedInfraction.infractionType).equal('WITH_REPORT')
      expect(duplicatedInfraction.natinf.length).equal(2)
      expect(duplicatedInfraction.observations).equal("Pas d'observations")
      expect(duplicatedInfraction.registrationNumber).equal('BALTIK')
      expect(duplicatedInfraction.relevantCourt).equal('LOCAL_COURT')
      expect(duplicatedInfraction.toProcess).equal(false)
      expect(duplicatedInfraction.vesselSize).equal(45)
      expect(duplicatedInfraction.vesselType).equal('COMMERCIAL')
      expect(duplicatedInfraction.id).not.equal('b8007c8a-5135-4bc3-816f-c69c7b75d807')
    })
  })

  it('Allow only one theme and multiple subthemes in control actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').scrollIntoView().click({ force: true })
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('*[data-cy="envaction-theme-element"]').should('have.length', 1)
    cy.get('*[data-cy="envaction-theme-selector"]').contains('Mouillage individuel') // id 100
    cy.get('*[data-cy="envaction-theme-element"]').contains('Mouillage avec AOT individuelle') // id 102
    cy.get('*[data-cy="envaction-tags-selector"]').should('not.exist')

    // When
    cy.fill('Thématique de contrôle', 'Espèce protégée') // id 103
    cy.wait(250)
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]')
      .contains("Destruction, capture, arrachage d'espèces protégées")
      .click({ force: true }) // id 117
    cy.get('*[data-cy="envaction-theme-element"]').contains('Détention des espèces protégées').click({ force: true }) // id 120

    cy.wait(250)
    cy.get('*[data-cy="envaction-tags-selector"]').should('exist')
    cy.get('*[data-cy="envaction-tags-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Habitat').click({ force: true }) // id 15
    cy.get('*[data-cy="envaction-theme-element"]').contains('Oiseaux').click({ force: true }) // id 11
    cy.get('*[data-cy="envaction-theme-element"]').click('topLeft', { force: true })

    /*  
    TODO: fix this command in monitor-ui
    cy.fill(
      'Sous-thématiques de contrôle',
      ["Destruction, capture, arrachage d'espèces protégées", 'Détention des espèces protégées'], // id 117 and 120
      { delay: 250 }
    ) 
    cy.fill('Précisions sur la thématique', ['Habitat', 'Oiseaux'], { delay: 250 }) // id 15 and 11
    */
    cy.get('*[data-cy="envaction-add-theme"]').should('not.exist')
    cy.wait(500)

    // Then
    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          envActions: [
            {
              controlPlans: [{ subThemeIds: [117, 120], tagIds: [15, 11], themeId: 103 }],
              id: 'b8007c8a-5135-4bc3-816f-c69c7b75d807'
            }
          ]
        }
      },
      10,
      0,
      response => {
        expect(response && response.statusCode).equal(200)

        const { controlPlans } = response.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')

        expect(controlPlans.length).equal(1)
        expect(controlPlans[0].themeId).equal(103)

        expect(controlPlans[0].subThemeIds.length).equal(2)
        expect(controlPlans[0].subThemeIds[0]).equal(117)
        expect(controlPlans[0].subThemeIds[1]).equal(120)
        expect(controlPlans[0].tagIds.length).equal(2)
        expect(controlPlans[0].tagIds[0]).equal(15)
        expect(controlPlans[0].tagIds[1]).equal(11)
      }
    )
  })

  it('Save observations in control Actions', () => {
    cy.wait(250)
    cy.get('*[data-cy="edit-mission-34"]').scrollIntoView().click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(1).click()

    cy.getDataCy('control-form-observations').contains('RAS')

    // When
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.getDataCy('control-form-observations').type('{backspace}{backspace}Une observation importante.', {
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
              observations: 'RUne observation importante.'
            }
          ]
        }
      },
      5,
      0,
      response => {
        const { observations } = response.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
        expect(observations).equal('RUne observation importante.')

        expect(response && response.statusCode).equal(200)
        expect(
          response && response.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')?.observations
        ).equal('RUne observation importante.')
      }
    )
  })

  it('Allow multiple themes and multiple subthemes in surveillance actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').scrollIntoView().click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(0).click()
    cy.get('*[data-cy="envaction-theme-element"]').should('have.length', 2)
    cy.get('*[data-cy="envaction-theme-selector"]').eq(0).contains('Espèce protégée et leur habitat (faune et flore)') // id 103
    cy.get('*[data-cy="envaction-theme-element"]').contains('Destruction, capture, arrachage') // id 117
    cy.get('*[data-cy="envaction-tags-selector"]').should('exist')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Habitat') // id 15
    cy.get('*[data-cy="envaction-theme-element"]').contains('Oiseaux') // id 11

    // When
    cy.get('*[data-cy="envaction-theme-selector"]').eq(0).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(0).contains('Épave').click({ force: true }) // id 105

    cy.get('*[data-cy="envaction-add-theme"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-selector"]').eq(2).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(2).contains('Rejet').click({ force: true }) // id 102

    cy.get('*[data-cy="envaction-subtheme-selector"]').eq(2).click({ force: true })
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('*[data-cy="envaction-theme-element"]').eq(2).contains("Rejet d'hydrocarbure").click({ force: true }) // id 74

    cy.get('*[data-cy="envaction-tags-selector"]').should('have.length', 0)

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)

      const { controlPlans } =
        response && response.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
      expect(controlPlans.length).equal(3)

      expect(controlPlans[0].themeId).equal(100)
      expect(controlPlans[0].subThemeIds.length).equal(2)
      expect(controlPlans[0].subThemeIds[0]).equal(100)
      expect(controlPlans[0].subThemeIds[1]).equal(102)
      expect(controlPlans[0].tagIds.length).equal(0)
      0
      expect(controlPlans[1].themeId).equal(105)
      expect(controlPlans[1].subThemeIds.length).equal(0)
      expect(controlPlans[1].tagIds.length).equal(0)

      expect(controlPlans[2].themeId).equal(102)
      expect(controlPlans[2].subThemeIds.length).equal(1)
      expect(controlPlans[2].subThemeIds[0]).equal(110)
      expect(controlPlans[2].tagIds.length).equal(0)
    })
  })

  it(`Should be able to delete action with linked reporting`, () => {
    // Given
    cy.get('*[data-cy="edit-mission-34"]').scrollIntoView().click({ force: true })
    cy.wait(500)
    cy.get('*[data-cy="action-card"]').eq(0).click()

    cy.wait(500)
    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('*[data-cy="actioncard-delete-button-b8007c8a-5135-4bc3-816f-c69c7b75d807"]').click()

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
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.wait(250)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.wait(500)
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')
    cy.get('[id="envActions[0].observations"]').type('Obs.', {
      force: true
    })

    cy.getDataCy('surveillance-open-by').type('ABC')
    cy.getDataCy('surveillance-completed-by').type('ABC')

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
    cy.wait(400)

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

    cy.getDataCy('action-missing-fields-text').contains('3 champs nécessaires aux statistiques à compléter')

    cy.get('*[data-cy="envaction-theme-selector"]').eq(0).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(0).contains('Épave').click({ force: true }) // id 105
    cy.get('*[data-cy="envaction-subtheme-selector"]').eq(0).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]')
      .eq(0)
      .contains("Découverte d'une épave maritime")
      .click({ force: true }) // id 128
    cy.get('*[data-cy="envaction-theme-element"]').eq(0).contains('Autre (Épave)').click({ force: true }) // id 131
    cy.get('*[data-cy="envaction-theme-element"]').click('topLeft', { force: true })
    cy.getDataCy('surveillance-open-by').type('ABC', { force: true })
    cy.getDataCy('surveillance-completed-by').type('ABC', { force: true })

    // All fields are filled
    cy.getDataCy('action-all-fields-are-filled-text').should('exist')
    cy.getDataCy('action-all-fields-completed').should('exist')

    // Add a control
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')
    cy.getDataCy('action-missing-fields-text').contains('7 champs nécessaires aux statistiques à compléter')

    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')

    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Pêche de loisir (autre que PAP)').click({ force: true }) // id 112
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Pêche embarquée').click({ force: true }) // id 173
    cy.get('*[data-cy="envaction-theme-element"]').click('topLeft', { force: true })

    cy.getDataCy('control-open-by').scrollIntoView().type('ABC')
    cy.getDataCy('control-completed-by').scrollIntoView().type('ABC')
    cy.getDataCy('action-missing-fields-text').contains('4 champs nécessaires aux statistiques à compléter')

    cy.wait(250)
    // Then
    cy.waitForLastRequest('@updateMission', {}, 5, 0, response => {
      expect(response && response.statusCode).equal(200)
      const { envActions } = response && response.body
      expect(envActions.length).equal(2)
      // control
      const control = envActions.find(a => a.actionType === 'CONTROL')
      const controlPlans = control.controlPlans[0]
      expect(controlPlans.themeId).equal(112)
      expect(controlPlans.subThemeIds.length).equal(1)
      expect(controlPlans.subThemeIds[0]).equal(173)

      // surveillance
      const surveillance = envActions.find(a => a.actionType === 'SURVEILLANCE')
      const surveillanceControlPlans = surveillance.controlPlans[0]
      expect(surveillanceControlPlans.themeId).equal(105)
      expect(surveillanceControlPlans.subThemeIds.length).equal(2)
      expect(surveillanceControlPlans.subThemeIds[0]).equal(128)
      expect(surveillanceControlPlans.subThemeIds[1]).equal(131)

      const id = response && response.body.id
      // update mission date to 2023
      cy.fill('Date de début (UTC)', [2023, 5, 26, 12, 0], { delay: 400 })
      cy.intercept('PUT', `/bff/v1/missions/${id}`).as('updateMissionTwo')
      cy.fill('Date de fin (UTC)', [2023, 5, 28, 14, 15])

      cy.getDataCy('completion-mission-status-tag-to-completed-mission-ended').should('exist')

      // check if themes in control has been reset
      cy.wait(250)
      cy.get('*[data-cy="action-card"]').eq(0).click()
      cy.getDataCy('action-missing-fields-text').contains('6 champs nécessaires aux statistiques à compléter')

      // check if themes in surveillance has been reset
      cy.wait(250)
      cy.get('*[data-cy="action-card"]').eq(1).click()
      cy.getDataCy('action-missing-fields-text').contains('2 champs nécessaires aux statistiques à compléter')

      // delete created mission
      cy.clickButton('Supprimer la mission')
      cy.wait(400)
      cy.get('*[name="delete-mission-modal-confirm"]').click()
    })
  })

  it('Save other control actions', () => {
    cy.get('*[data-cy="edit-mission-41"]').scrollIntoView().click({ force: true })
    cy.get('*[data-cy="action-card"]').eq(0).click()

    cy.intercept('PUT', '/bff/v1/missions/41').as('updateMission')

    // verify if fields are checked
    cy.get('*[name="envActions[0].isAdministrativeControl"]').scrollIntoView().should('be.checked')
    cy.get('*[name="envActions[0].isComplianceWithWaterRegulationsControl"]').should('be.checked')
    cy.get('*[name="envActions[0].isSafetyEquipmentAndStandardsComplianceControl"]').should('be.checked')
    cy.get('*[name="envActions[0].isSeafarersControl"]').should('be.checked')

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

        const controlActionResponse = response?.body.envActions[0]
        expect(controlActionResponse.isAdministrativeControl).equal(false)
        expect(controlActionResponse.isComplianceWithWaterRegulationsControl).equal(false)
        expect(controlActionResponse.isSafetyEquipmentAndStandardsComplianceControl).equal(false)
        expect(controlActionResponse.isSeafarersControl).equal(false)
        cy.log('controlActionResponse', controlActionResponse)

        cy.clickButton('Fermer')
        cy.get('*[data-cy="edit-mission-41"]').scrollIntoView().click({ force: true })
        cy.get('*[data-cy="action-card"]').eq(0).click()
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
    cy.get('*[data-cy="edit-mission-53"]').scrollIntoView().click({ force: true })
    cy.getDataCy('cnsp-action-text').should('have.length', 5)
  })

  it("Should display warning toast if fish api doesn't respond", () => {
    cy.fill('Période', 'Un mois')
    cy.wait(500)
    cy.getDataCy('edit-mission-27').scrollIntoView().click({ force: true })
    cy.get('.Toastify__toast-body').contains(
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

      cy.fill('Nb total de contrôles', 1)
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
      cy.fill('Mise en demeure', 'Oui')
      cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])

      cy.getDataCy('control-open-by').type('ABC')
      cy.wait(250)

      cy.wait('@updateMission').then(({ request, response }) => {
        // check request
        const requestInfraction = request.body.envActions[0].infractions[0]
        expect(requestInfraction.mmsi).equal('123456789')
        expect(requestInfraction.vesselName).equal('BALTIK')
        expect(requestInfraction.imo).equal('IMO123')
        expect(requestInfraction.controlledPersonIdentity).equal('John Doe')
        expect(requestInfraction.registrationNumber).equal('ABC123')
        expect(requestInfraction.vesselSize).equal(45)
        expect(requestInfraction.vesselType).equal('COMMERCIAL')

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
      cy.fill('Mise en demeure', 'Oui')
      cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])
      cy.clickButton("Valider l'infraction")

      // cases without identification
      cy.getDataCy('infraction-0-identification').contains('Personne morale')

      cy.fill('Type de cible', 'Personne physique')
      cy.getDataCy('infraction-0-identification').contains('Personne physique')

      cy.fill('Type de cible', 'Véhicule')
      cy.getDataCy('infraction-0-identification').contains('Véhicule - Type non renseigné')

      cy.fill('Type de véhicule', 'Navire')
      cy.getDataCy('infraction-0-identification').contains('Véhicule - Navire')

      // cases with identification
      // Company
      cy.fill('Type de cible', 'Personne morale')
      cy.clickButton('Editer')
      cy.fill('Identité de la personne contrôlée', 'John Doe')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('John Doe')

      cy.clickButton('Editer')
      cy.fill('Nom de la personne morale', 'World company')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('World company - John Doe')

      // Individual
      cy.fill('Type de cible', 'Personne physique')
      cy.getDataCy('infraction-0-identification').contains('John Doe')

      // Vehicle
      cy.fill('Type de cible', 'Véhicule')
      cy.fill('Type de véhicule', 'Navire')

      cy.clickButton('Editer')
      cy.fill('Immatriculation', 'ABC123')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('ABC123')

      cy.clickButton('Editer')
      cy.fill('IMO', 'IMO123')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('IMO123')

      cy.clickButton('Editer')
      cy.fill('MMSI', '123456789')
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('infraction-0-identification').contains('123456789')

      cy.clickButton('Editer')
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

  it('Should keep pending action when switching tabs', () => {
    createPendingMission().then(() => {
      // Add a control
      cy.clickButton('Ajouter')
      cy.clickButton('Ajouter des contrôles')
      cy.wait(500)

      cy.fill('Nb total de contrôles', 1)
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
