import { FAKE_MAPBOX_RESPONSE } from '../../constants'
import { createReporting } from '../../utils/createReporting'
import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'

context('Reporting', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.viewport(1580, 1024)

    cy.visit(`/`, {
      onBeforeLoad() {
        Cypress.env('CYPRESS_REPORTING_FORM_AUTO_SAVE_ENABLED', 'true')
      }
    })
    cy.wait(500)
  })

  it('A reporting can be created', () => {
    // Given
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')
    cy.wait(1000)

    // When
    cy.get('div').contains('Signalement non créé')
    cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')

    cy.getDataCy('reporting-target-type').click({ force: true })
    cy.get('div[role="option"]').contains('Personne morale').click()

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(250, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')

    cy.get('.rs-radio').find('label').contains('Observation').click()

    cy.fill('Thématique du signalement', 'Culture marine')
    cy.fill('Sous-thématique du signalement', ['Remise en état après occupation du DPM'])

    const { asApiDateTime, asDatePickerDateTime } = getUtcDateInMultipleFormats()
    cy.fill('Date et heure (UTC)', asDatePickerDateTime)
    cy.fill('Saisi par', 'XYZ')

    // Then
    cy.wait('@createReporting').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        createdAt: `${asApiDateTime}:00.000Z`,
        openBy: 'XYZ',
        reportType: 'OBSERVATION',
        semaphoreId: 35,
        sourceType: 'SEMAPHORE',
        targetDetails: [],
        targetType: 'COMPANY',
        validityTime: 24
      })
    })

    cy.get('div').contains('Dernière modification le')
  })

  it('A mission can be attached to a reporting', () => {
    // Given
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    cy.intercept('PUT', '/bff/v1/reportings/*').as('createReporting')

    // When
    cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')

    cy.get('*[data-cy="reporting-target-type"]').click({ force: true })
    cy.get('div[role="option"]').contains('Personne morale').click()

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(350, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')

    cy.get('.rs-radio').find('label').contains('Infraction (susp.)').click()

    cy.fill('Thématique du signalement', 'Culture marine')
    cy.fill('Sous-thématique du signalement', ['Remise en état après occupation du DPM'])

    cy.fill('Saisi par', 'XYZ')
    cy.wait(500)

    cy.clickButton('Lier à une mission existante')
    cy.get('#root').click(582, 546, { timeout: 10000 })
    cy.wait(250)
    cy.clickButton('Lier à la mission')

    // Then
    cy.waitForLastRequest(
      '@createReporting',
      {
        body: {
          missionId: 33,
          openBy: 'XYZ',
          reportType: 'INFRACTION_SUSPICION',
          semaphoreId: 35,
          sourceType: 'SEMAPHORE',
          targetDetails: [],
          targetType: 'COMPANY',
          validityTime: 24
        }
      },
      5,
      0,
      response => {
        expect(response && response.statusCode).equal(200)
      }
    )
  })

  it('A mission can be detached from a reporting', () => {
    // Given
    cy.intercept('PUT', '/bff/v1/reportings/*').as('updateReporting')
    cy.wait(1000)
    cy.get('#root').click(350, 690, { timeout: 10000 })
    cy.wait(1000)
    cy.clickButton('Editer le signalement')

    // When
    cy.clickButton('Détacher la mission')

    // Then
    cy.wait('@updateReporting').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }
      cy.get(interception.request.body.attachedToMissionAtUtc).should('not.be.null')
      cy.get(interception.request.body.detachedToMissionAtUtc).should('not.be.null')
      assert.deepInclude(interception.request.body, {
        openBy: 'XYZ',
        reportType: 'INFRACTION_SUSPICION',
        semaphoreId: 35,
        sourceType: 'SEMAPHORE',
        targetDetails: [],
        targetType: 'COMPANY',
        validityTime: 24
      })
    })
  })

  it('An attached mission can be reinitialize during reporting creation', () => {
    // Given
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')
    cy.wait(1000)

    // When
    cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')

    cy.getDataCy('reporting-target-type').click({ force: true })
    cy.get('div[role="option"]').contains('Personne morale').click()

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(350, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')

    cy.get('.rs-radio').find('label').contains('Infraction').click()

    cy.fill('Thématique du signalement', 'Culture marine')
    cy.fill('Sous-thématique du signalement', ['Remise en état après occupation du DPM'])

    cy.wait(500)
    cy.clickButton('Lier à une mission existante')
    cy.get('#root').click(582, 546)
    cy.wait(1000)
    cy.clickButton('Réinitialiser')
    cy.fill('Saisi par', 'XYZ')

    // Then
    cy.wait('@createReporting').then(({ response }) => {
      expect(response && response.statusCode).equal(201)
      const responseBody = response && response.body
      expect(responseBody.missionId).equal(null)
      expect(responseBody.attachedMission).equal(null)
    })
  })

  it('A reporting can be created with withVHFAnswer only for `mouillage individuel` theme', () => {
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')

    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')
    cy.intercept('PUT', '/bff/v1/reportings/*').as('updateReporting')

    cy.get('.Element-Legend').contains('Réponse à la VHF').should('not.exist')

    cy.fill('Source', 'Autre')
    cy.fill('Nom, société ...', 'Nom de ma société')

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(450, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')
    cy.fill('Type de signalement', 'Observation')
    cy.fill('Thématique du signalement', 'Mouillage individuel')
    cy.fill('Sous-thématique du signalement', ['Mouillage réglementé par AMP'])

    cy.get('.Element-Legend').contains('Réponse à la VHF').should('be.visible')
    cy.fill('Réponse à la VHF', 'Oui')

    cy.fill('Saisi par', 'XYZ')

    cy.wait('@createReporting').then(({ request, response }) => {
      expect(request.body.themeId).equal(100)
      expect(request.body.withVHFAnswer).equal(true)

      expect(response && response.statusCode).equal(201)
      expect(response?.body.themeId).equal(100)
      expect(response?.body.withVHFAnswer).equal(true)
    })

    cy.wait(500)

    // we update reporting theme and clean `withVHFAnswer` field
    cy.fill('Thématique du signalement', 'Bien culturel maritime')
    cy.fill('Sous-thématique du signalement', ["Prospection d'un bien culturel maritime"])

    cy.waitForLastRequest(
      '@updateReporting',
      {
        body: {
          openBy: 'XYZ',
          reportType: 'OBSERVATION',
          targetDetails: [],
          themeId: 104,
          validityTime: 24
        }
      },
      5,
      0,
      response => {
        expect(response && response.statusCode).equal(200)
        expect(response?.body.themeId).equal(104)
        expect(response?.body.withVHFAnswer).equal(null)
      }
    )

    // delete reporting
    cy.clickButton('Supprimer le signalement')
    cy.clickButton('Confirmer la suppression')
  })

  it('Should save target detail when vessel type is "VESSEL"', () => {
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    createReporting().then(({ response: createdResponse }) => {
      const reporting = createdResponse?.body
      cy.intercept('PUT', `/bff/v1/reportings/${reporting.id}`).as('updateReporting')

      // Fill in the vessel informations
      cy.fill('Type de cible', 'Véhicule')
      cy.fill('Type de véhicule', 'Navire')
      cy.fill('MMSI', '123456789')
      cy.fill('Nom du navire', 'BALTIK')
      cy.fill('IMO', 'IMO123')
      cy.fill('Nom du capitaine', 'John Doe')
      cy.fill('Immatriculation', 'ABC123')
      cy.fill('Taille', 45)
      cy.fill('Type de navire', 'Commerce')

      cy.waitForLastRequest(
        '@updateReporting',
        {
          body: {
            targetDetails: [
              {
                externalReferenceNumber: 'ABC123',
                imo: 'IMO123',
                mmsi: '123456789',
                operatorName: 'John Doe',
                size: 45,
                vesselName: 'BALTIK',
                vesselType: 'COMMERCIAL'
              }
            ],
            targetType: 'VEHICLE',
            vehicleType: 'VESSEL'
          }
        },
        12,
        0,
        response => {
          // check response
          const reportingUpdated = response?.body.targetDetails[0]
          expect(response && response.statusCode).equal(200)
          expect(response?.body.vehicleType).equal('VESSEL')
          expect(response?.body.targetType).equal('VEHICLE')
          expect(reportingUpdated.mmsi).equal('123456789')
          expect(reportingUpdated.vesselName).equal('BALTIK')
          expect(reportingUpdated.imo).equal('IMO123')
          expect(reportingUpdated.operatorName).equal('John Doe')
          expect(reportingUpdated.externalReferenceNumber).equal('ABC123')
          expect(reportingUpdated.size).equal(45)
          expect(reportingUpdated.vesselType).equal('COMMERCIAL')

          // clean
          cy.wait(250)
          cy.clickButton('Supprimer le signalement')
          cy.clickButton('Confirmer la suppression')
        }
      )
    })
  })
})
