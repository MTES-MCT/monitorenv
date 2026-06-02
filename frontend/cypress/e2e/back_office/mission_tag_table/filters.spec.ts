const totalMissionTags = 5

context('Back Office > Tag Table > Filters', () => {
  beforeEach(() => {
    cy.visit(`/backoffice/mission_tags`)
    cy.intercept('GET', `/bff/v1/missions/tags`).as('getMissionTags')
    cy.wait('@getMissionTags')
  })

  it('Should show all mission tags ', () => {
    cy.get('tbody > tr').should('have.length', totalMissionTags)
  })

  it('Should filter mission tags matching the search query', () => {
    cy.get('tbody > tr').should('have.length', totalMissionTags)
    cy.fill('Rechercher dans les étiquettes de mission', 'tag 1')
    cy.get('tbody > tr').should('have.length', 1)
  })

  it('Should show archived mission tags when filter is set', () => {
    cy.fill('Rechercher par statut', 'Archivés')

    cy.get('tbody > tr').should('have.length', 2)
  })

  it('Should show active mission tags when filter is set', () => {
    cy.fill('Rechercher par statut', 'Actifs')

    cy.get('tbody > tr').should('have.length', 3)
  })
})
