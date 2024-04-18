import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'

context('Side Window > Mission List > Filter Bar', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.visit(`/side_window`).wait(1000)
  })

  it('Should filter missions for the current day', () => {
    cy.fill('Période', 'Aujourd’hui')
    cy.wait('@getMissions')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions for the current month', () => {
    cy.fill('Période', 'Un mois')
    cy.wait('@getMissions')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions for the custom date range', () => {
    const expectedStartDate = getUtcDateInMultipleFormats('2023-05-01T00:00:00.000Z')
    const expectedEndDate = getUtcDateInMultipleFormats('2023-05-31T23:59:59.000Z')

    cy.fill('Période', 'Période spécifique')
    cy.fill('Période spécifique', [expectedStartDate.utcDateTuple, expectedEndDate.utcDateTuple])
    cy.wait('@getMissions')
  })

  it('Should filter missions by completion status', () => {
    cy.fill('Etat des données', ['Complétées'])
    cy.wait('@getMissions')

    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('données Complétées')
    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Complétées')
    })

    cy.fill('Etat des données', undefined)
  })

  it('Should filter missions by administrations', () => {
    cy.fill('Administration', ['DDTM'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DDTM')
    })
    cy.fill('Administration', undefined)
  })

  it('Should filter missions by units', () => {
    cy.fill('Unité', ['BSN'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'BSN Ste Maxime')
    })

    cy.fill('Unité', undefined)
  })

  it('Should filter missions by administration, and units filter accordingly.', () => {
    // selected an administration that does not correspond to the selected unit
    cy.fill('Unité', ['DPM – DDTM 14'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Unité DPM – DDTM 14')
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DPM – DDTM 14')
    })
    cy.fill('Administration', ['DREAL / DEAL'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Admin. DREAL / DEAL')
    cy.getDataCy('missions-filter-tags')
      .find('.Component-SingleTag > span')
      .should('not.contain', 'Unité DPM - DDTM 14')
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DREAL / DEAL')
    })

    // selected an administration corresponding to the selected unit
    cy.fill('Administration', undefined)
    cy.fill('Unité', ['DREAL Pays-de-La-Loire'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Unité DREAL Pays-de-La-Loire')
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DREAL Pays-de-La-Loire')
    })
    cy.fill('Administration', ['DREAL / DEAL'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Admin. DREAL / DEAL')
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Unité DREAL Pays-de-La-Loire')
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DREAL Pays-de-La-Loire (DREAL / DEAL)')
    })

    // clear filters
    cy.fill('Administration', undefined)
    cy.fill('Unité', undefined)
  })

  it('Should filter missions by types', () => {
    cy.fill('Type de mission', ['Mer'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Mer')
    })

    cy.fill('Type de mission', undefined)
  })

  it('Should filter missions by sea fronts', () => {
    cy.fill('Facade', ['MED'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'MED')
    })

    cy.fill('Facade', undefined)
  })

  it('Should filter missions by statuses', () => {
    cy.fill('Statut de mission', ['En cours'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'En cours')
    })

    cy.fill('Statut de mission', undefined)
  })

  it('Should filter missions by themes', () => {
    cy.wait(200)
    cy.fill('Thématique', ['Mouillage individuel'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Mouillage individuel')
    })

    cy.fill('Thématique', undefined)
  })

  it('Should themes filter depends on date filter', () => {
    cy.fill('Période', 'Période spécifique')

    // for year 2024
    cy.fill('Période spécifique', [
      [2024, 1, 1],
      [2024, 3, 3]
    ])
    cy.wait(500)
    cy.wait('@getMissions')

    cy.get('*[data-cy="mission-theme-filter"]').click()
    cy.get('#theme-listbox > div').should('have.length', 18)

    cy.wait(200)

    // on two years
    cy.fill('Période spécifique', [
      [2023, 1, 1],
      [2024, 3, 3]
    ])
    cy.wait(500)
    cy.wait('@getMissions')

    cy.get('*[data-cy="mission-theme-filter"]').click()
    cy.get('#theme-listbox > div').should('have.length', 34)
  })

  it('Should filter missions with env actions', () => {
    cy.fill('Missions avec actions env.', true)
    cy.wait('@getMissions')

    cy.get('.Table-SimpleTable tr').should('have.length', 6)
    cy.getDataCy('edit-mission-53').should('exist')
    cy.getDataCy('edit-mission-38').should('exist')
    cy.getDataCy('edit-mission-22').should('not.exist')
    cy.getDataCy('edit-mission-43').should('not.exist')

    cy.fill('Missions avec actions env.', false)
  })
})
