export function getTableRowByText(
  prevSubjectElements: HTMLElement[] | undefined,
  text: string
): Cypress.Chainable<JQuery<HTMLElement>> {
  const prevSubjectElement = prevSubjectElements ? prevSubjectElements[0] : undefined
  if (prevSubjectElements && !prevSubjectElements[0]) {
    throw new Error('`prevSubjectElements[0]` is undefined.')
  }

  return (prevSubjectElement ? cy.wrap(prevSubjectElement) : cy.get('body'))
    .first()
    .contains(`.Table-SimpleTable tr`, text)
}
