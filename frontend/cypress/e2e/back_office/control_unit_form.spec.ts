import { FAKE_API_POST_RESPONSE, FAKE_API_PUT_RESPONSE } from '../constants'

context('Back Office > Control Unit Form', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api/v2/control_units`).as('getControlUnits')

    cy.visit(`/backoffice/control_units`)

    cy.wait('@getControlUnits')
  })

  it('Should create a control unit', () => {
    cy.intercept('POST', `/api/v2/control_units`, FAKE_API_POST_RESPONSE).as('createControlUnit')

    cy.clickButton('Nouvelle unité de contrôle')

    cy.fill('Administration', 'AECP')
    cy.fill('Nom', 'Unité 1')
    cy.fill("Zone d'intervention", 'Une zone.')
    cy.fill('Modalités de contact avec l’unité', 'Des modalités.')

    cy.clickButton('Créer')

    cy.wait('@createControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepEqual(interception.request.body, {
        administrationId: 1007,
        areaNote: 'Une zone.',
        controlUnitContactIds: [],
        controlUnitResourceIds: [],
        isArchived: false,
        name: 'Unité 1',
        termsNote: 'Des modalités.'
      })
    })
  })

  it('Should edit a control unit', () => {
    cy.intercept('PUT', `/api/v2/control_units/12`, FAKE_API_PUT_RESPONSE).as('updateControlUnit')

    cy.clickButton('Éditer cette unité de contrôle', {
      withinSelector: 'tbody > tr:nth-child(7)'
    })

    cy.fill('Administration', 'AFB')
    cy.fill('Nom', 'Unité 2')
    cy.fill("Zone d'intervention", 'Une autre zone.')
    cy.fill('Modalités de contact avec l’unité', "D'autres modalités.")

    cy.clickButton('Mettre à jour')

    cy.wait('@updateControlUnit').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        administrationId: 1002,
        areaNote: 'Une autre zone.',
        controlUnitContactIds: [],
        controlUnitResourceIds: [9],
        id: 12,
        isArchived: false,
        name: 'Unité 2',
        termsNote: "D'autres modalités."
      })
    })
  })
})
