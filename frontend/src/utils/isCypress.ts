/**
 * Detects whether the browser app is running in Cypress.
 *
 * @see https://docs.cypress.io/faq/questions/using-cypress-faq#Is-there-any-way-to-detect-if-my-app-is-running-under-Cypress
 */
export function isCypress() {
  return !!window.Cypress
}
