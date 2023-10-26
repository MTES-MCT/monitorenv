export function expectPathToBe(expectedPath: string) {
  cy.location().should(location => {
    assert.equal(location.pathname, expectedPath)
  })
}
