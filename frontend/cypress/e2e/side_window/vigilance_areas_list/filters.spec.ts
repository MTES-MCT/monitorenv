context('Side Window > Vigilance Areas List > Filter Bar', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`).wait(1000)
    cy.clickButton('Zones de vigilance')
  })

  afterEach(() => {
    cy.getDataCy('reinitialize-filters').scrollIntoView().click()
  })

  it('Should filter vigilance areas for the current year', () => {
    cy.fill('Période de vigilance', 'Cette année')

    cy.getDataCy('vigilance-area-row').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter vigilance areas by themes filter', () => {
    cy.wait(500)
    cy.fill('Thématique réglementaire', ['Dragage'])

    cy.getDataCy('vigilance-areas-filter-tags').find('.Component-SingleTag > span').contains('Dragage')
    cy.getDataCy('vigilance-area-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('vigilance-area-row').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Dragage')
    })
  })

  it('Should filter vigilance areas by createdBy filter', () => {
    cy.fill('Zone créée par...', ['ABC'])

    cy.getDataCy('vigilance-area-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('vigilance-area-row').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'ABC')
    })
  })

  it('Should filter missions by seaFront filter', () => {
    cy.fill('Façade', ['NAMO'])

    cy.getDataCy('vigilance-area-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('vigilance-area-row').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'NAMO')
    })
  })

  it('Should filter missions by draft status', () => {
    // uncheck published status
    cy.fill('Publiée', false)

    cy.getDataCy('vigilance-area-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('vigilance-area-row').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Non Publiée')
    })
  })

  it('Should filter missions by published status', () => {
    // uncheck draft status
    cy.fill('Non publiée', false)

    cy.getDataCy('vigilance-area-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('vigilance-area-row').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Publiée')
    })
  })

  it('Should filter missions by search query', () => {
    cy.fill('Rechercher dans les zones de vigilance', 'Proin')

    cy.getDataCy('vigilance-area-row').should('have.length', 1)
  })
})
