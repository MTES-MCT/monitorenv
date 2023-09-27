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

    cy.clickButton('Créer')

    cy.wait('@createBase').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepEqual(interception.request.body, {
        name: 'Base 1'
      })
    })
  })

  it('Should edit a base', () => {
    cy.intercept('PUT', `/api/v1/bases/3`, FAKE_API_PUT_RESPONSE).as('updateBase')

    cy.clickButton('Éditer cette base', {
      withinSelector: 'tbody > tr:nth-child(2)'
    })

    cy.fill('Nom', 'Base 2')

    cy.clickButton('Mettre à jour')

    cy.wait('@updateBase').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        id: 3,
        name: 'Base 2'
      })
    })
  })
})
