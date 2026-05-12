export function checkA11y() {
  cy.checkA11y(
    undefined,
    {
      rules: {
        'color-contrast': { enabled: false }
      },
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    },
    violations => {
      violations.forEach(violation => {
        cy.log(`♿ ${violation.id}: ${violation.description}`)
      })
    }
  )
}
