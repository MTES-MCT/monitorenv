import { FAKE_API_POST_RESPONSE, FAKE_API_PUT_RESPONSE } from '../contants'

context('Back Office > Administration Form', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v1/administrations`).as('getAdministrations')

    cy.visit(`/backoffice/administrations`)

    cy.wait('@getAdministrations')
  })

  it('Should create an administration', () => {
    cy.intercept('POST', `/api/v1/administrations`, FAKE_API_POST_RESPONSE).as('createAdministration')

    cy.clickButton('Nouvelle administration')

    cy.fill('Nom', 'Administration 1')

    cy.clickButton('Créer')

    cy.wait('@createAdministration').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        name: 'Administration 1'
      })
    })
  })

  it('Should edit an administration', () => {
    cy.intercept('PUT', `/api/v1/administrations/1001`, FAKE_API_PUT_RESPONSE).as('updateAdministration')

    cy.clickButton('Éditer cette administration', {
      withinSelector: 'tbody > tr:first-child'
    })

    cy.fill('Nom', 'Administration 2')

    cy.clickButton('Mettre à jour')

    cy.wait('@updateAdministration').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        id: 1001,
        name: 'Administration 2'
      })
    })
  })
})
