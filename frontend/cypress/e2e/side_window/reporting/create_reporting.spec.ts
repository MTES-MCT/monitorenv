import { setGeometry } from '../../../../src/domain/shared_slices/Draw'
import { FAKE_API_PUT_RESPONSE } from '../../constants'

import type { GeoJSON } from '../../../../src/domain/types/GeoJSON'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

context('Reportings', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.clickButton('signalements')
    cy.wait('@getReportings')
  })

  it('Reporting should be created with no themes and sub-themes when year of date change', () => {
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
    cy.fill('Thématique du signalement', 'Atteintes aux biens culturels maritimes')
    cy.fill('Sous-thématique du signalement', ['Atteinte aux biens culturels', 'Contrôle administratif'])

    cy.get('.rs-radio').find('label').contains('Observation').click()
    cy.fill('Saisi par', 'XYZ')

    // change date year
    cy.fill('Date et heure (UTC)', [2024, 5, 26, 23, 35])

    cy.clickButton('Valider le signalement')

    // Then
    cy.wait('@createReporting').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        createdAt: '2024-05-26T23:35:00.000Z',
        openBy: 'XYZ',
        reportType: 'OBSERVATION',
        semaphoreId: 35,
        sourceType: 'SEMAPHORE',
        subThemeIds: [],
        targetDetails: [],
        targetType: 'COMPANY',
        validityTime: 24
      })
    })
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
    cy.fill('Thématique du signalement', 'Atteintes aux biens culturels maritimes')
    cy.fill('Sous-thématique du signalement', ['Atteinte aux biens culturels', 'Contrôle administratif'])

    cy.get('.rs-radio').find('label').contains('Observation').click()
    cy.fill('Saisi par', 'XYZ')

    // change date year
    cy.fill('Date et heure (UTC)', [2024, 5, 26, 23, 35])
    cy.fill('Thématique du signalement', 'Rejet')
    cy.fill('Sous-thématique du signalement', ['Carénage sauvage'])

    cy.clickButton('Valider le signalement')

    // Then

    cy.wait('@createReporting').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        createdAt: '2024-05-26T23:35:00.000Z',
        openBy: 'XYZ',
        reportType: 'OBSERVATION',
        semaphoreId: 35,
        sourceType: 'SEMAPHORE',
        subThemeIds: [108],
        targetDetails: [],
        targetType: 'COMPANY',
        themeId: 102,
        validityTime: 24
      })
    })
  })
})
