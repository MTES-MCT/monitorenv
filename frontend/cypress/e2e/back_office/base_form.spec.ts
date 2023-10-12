import { FAKE_API_POST_RESPONSE, FAKE_API_PUT_RESPONSE } from '../constants'

context('Back Office > Base Form', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/bases`).as('getBases')

    cy.visit(`/backoffice/bases`)

    cy.wait('@getBases')
  })

  it('Should create a base', () => {
    cy.intercept('POST', `/api/v1/bases`, FAKE_API_POST_RESPONSE).as('createBase')

    cy.clickButton('Nouvelle base')

    cy.fill('Nom', 'Base 1')
    cy.fill('Latitude', '1.2')
    cy.fill('Longitude', '3.4')

    cy.clickButton('Créer')

    cy.wait('@createBase').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepEqual(interception.request.body, {
        latitude: '1.2',
        longitude: '3.4',
        name: 'Base 1'
      })
    })
  })

  it('Should edit a base', () => {
    cy.intercept('PUT', `/api/v1/bases/1`, FAKE_API_PUT_RESPONSE).as('updateBase')

    cy.clickButton('Éditer cette base', {
      withinSelector: 'tbody > tr:nth-child(2)'
    })

    cy.fill('Nom', 'Base 2')
    cy.fill('Latitude', '5.6')
    cy.fill('Longitude', '7.8')

    cy.clickButton('Mettre à jour')

    cy.wait('@updateBase').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        id: 1,
        latitude: '5.6',
        longitude: '7.8',
        name: 'Base 2'
      })
    })
  })
})
