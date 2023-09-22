import { FAKE_API_PUT_RESPONSE, FAKE_MAPBOX_RESPONSE } from './contants'

context('Reporting', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.viewport(1580, 1024)
    cy.visit(`/`)
  })

  it('A reporting can be created', () => {
    // Given
    cy.clickButton('Chercher des signalements')
    cy.clickButton('Ajouter un signalement')
    cy.intercept('PUT', '/bff/v1/reportings', FAKE_API_PUT_RESPONSE).as('createReporting')

    // When
    cy.get('*[data-cy="add-semaphore-source"]').click({ force: true })
    cy.get('div[role="option"]').contains('Sémaphore de Dieppe').click()

    cy.get('*[data-cy="reporting-target-type"]').click({ force: true })
    cy.get('div[role="option"]').contains('Personne morale').click()

    cy.clickButton('Ajouter un point')
    cy.get('#root').click(250, 690, { timeout: 10000 })
    cy.clickButton('Valider le point')

    cy.get('.rs-radio').find('label').contains('Infraction (suspicion)').click()

    cy.fill('Saisi par', 'XYZ')

    cy.clickButton('Valider le signalement')

    // Then
    cy.wait('@createReporting').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

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
})
