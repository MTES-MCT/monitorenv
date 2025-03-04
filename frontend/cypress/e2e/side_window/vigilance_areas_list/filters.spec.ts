context('Side Window > Vigilance Areas List > Filter Bar', () => {
  beforeEach(() => {
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
    cy.clickButton('Zones de vigilance')
    cy.wait(['@getAmps', '@getRegulatoryAreas', '@getVigilanceAreas'])
  })

  afterEach(() => {
    cy.clickButton('Réinitialiser les filtres')
  })

  const verifyVigilanceAreaRows = (expectedText: string) => {
    cy.getDataCy('vigilance-area-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('vigilance-area-row').each((row, index) => {
      if (index === 0) {
        return
      }
      cy.wrap(row).should('contain', expectedText)
    })
  }

  it('Should filter vigilance areas for the current year', () => {
    cy.fill('Période de vigilance', 'Cette année')
    cy.getDataCy('vigilance-area-row').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter vigilance areas by themes filter', () => {
    cy.fill('Thématique réglementaire', ['Dragage'])
    cy.getDataCy('vigilance-areas-filter-tags').find('.Component-SingleTag > span').contains('Dragage')
    verifyVigilanceAreaRows('Dragage')
  })

  it('Should filter vigilance areas by createdBy filter', () => {
    cy.fill('Zone créée par...', ['ABC'])
    verifyVigilanceAreaRows('ABC')
  })

  it('Should filter vigilance areas by seaFront filter', () => {
    cy.fill('Façade', ['NAMO'])
    verifyVigilanceAreaRows('NAMO')
  })

  it('Should filter vigilance areas by draft status', () => {
    cy.fill('Publiée', false)
    verifyVigilanceAreaRows('Non Publiée')
  })

  it('Should filter vigilance areas by published status', () => {
    cy.fill('Non publiée', false)
    verifyVigilanceAreaRows('Publiée')
  })

  it('Should filter vigilance areas by search query', () => {
    cy.fill('Rechercher dans les zones de vigilance', 'Proin', { delay: 400 })
    cy.getDataCy('vigilance-area-row').should('have.length', 1)
  })
})
