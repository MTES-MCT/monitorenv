import { setGeometry } from '../../../../src/domain/shared_slices/Draw'
import { FAKE_API_PUT_RESPONSE } from '../../constants'
import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'

import type { GeoJSON } from '../../../../src/domain/types/GeoJSON'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

context('Reportings', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad() {
        Cypress.env('CYPRESS_REPORTING_FORM_AUTO_SAVE_ENABLED', 'true')
      }
    })
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.clickButton('Signalements')
    cy.wait('@getReportings')
  })

  it('Reporting should be created with available themes and sub-themes when year of date change', () => {
    cy.wait(1000)
    cy.clickButton('Ajouter un nouveau signalement')
    cy.intercept('PUT', '/bff/v1/reportings', FAKE_API_PUT_RESPONSE).as('createReporting')
    cy.wait(1000)

    // When
    cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')
    cy.getDataCy('reporting-target-type').click({ force: true })
    cy.get('div[role="option"]').contains('Personne morale').click()

    cy.clickButton('Ajouter un point')

    const geometry: GeoJSON.Geometry = {
      coordinates: [[-16.12054383, 49.94264815]],
      type: 'MultiPoint'
    }

    dispatch(setGeometry(geometry))

    // select themes and sub-themes for a specific year
    cy.fill('Date et heure (UTC)', [2023, 5, 26, 23, 35])
    // select sub-theme and prefill theme
    cy.fill('Sous-thématique du signalement', ['Atteinte aux biens culturels'])
    cy.getDataCy('reporting-theme-selector').contains('Atteintes aux biens culturels maritimes')
    cy.get('.rs-radio').find('label').contains('Observation').click()

    // change date year
    const { asApiDateTime, asDatePickerDateTime } = getUtcDateInMultipleFormats()
    cy.fill('Date et heure (UTC)', asDatePickerDateTime)
    cy.wait(250)
    cy.fill('Thématiques et sous-thématiques', ['Carénage sauvage'])
    cy.fill('Thématique du signalement', 'Rejet')
    cy.fill('Sous-thématique du signalement', ['Carénage sauvage'])

    cy.fill('Saisi par', 'XYZ')

    cy.wait('@createReporting').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        createdAt: `${asApiDateTime}:00.000Z`,
        openBy: 'XYZ',
        reportingSources: [
          {
            controlUnitId: null,
            id: null,
            reportingId: null,
            semaphoreId: 35,
            sourceName: null,
            sourceType: 'SEMAPHORE'
          }
        ],
        reportType: 'OBSERVATION',
        subThemeIds: [186],
        targetDetails: [],
        targetType: 'COMPANY',
        theme: {
          id: 102,
          name: 'Rejet',
          subThemes: [{ id: 299, name: 'Carénage sauvage' }]
        },
        themeId: 102,
        validityTime: 24
      })
    })
  })
})
