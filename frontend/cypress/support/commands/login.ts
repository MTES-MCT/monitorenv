export function login(user: string) {
  cy.session(user, () => {
    // We use a Cypress session to inject a Local Storage key
    // so that we can detect when the browser app is running in Cypress.
    // https://docs.cypress.io/faq/questions/using-cypress-faq#How-do-I-preserve-cookies--localStorage-in-between-my-tests
    cy.window().then(window => {
      window.localStorage.setItem('IS_CYPRESS', 'true')
    })
    cy.wait(100)

    cy.visit('/login')
    cy.wait(500)

    cy.intercept('GET', '/realms/monitor/**').as('authRequest')
    cy.intercept('**/realms/monitor/**').as('authResponse')

    cy.clickButton("S'identifier avec ProConnect")

    cy.wait(5000)

    cy.wait('@authRequest').then(interception => {
      cy.log(`Status: ${interception?.response?.statusCode}`)
      cy.log(`Headers: ${JSON.stringify(interception?.response?.headers)}`)
    })
    cy.wait('@authResponse').then(interception => {
      cy.log(`Status: ${interception?.response?.statusCode}`)
      cy.log(`Headers: ${JSON.stringify(interception?.response?.headers)}`)
    })

    cy.wait(5000)

    // Login with Keycloak
    cy.get('[name="username"]').type(user)
    cy.get('[name="password"]').type('monitorenv')
    cy.get('[name="login"]').click()

    cy.wait(5000)
  })
}
