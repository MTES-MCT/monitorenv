import { FAKE_MAPBOX_RESPONSE } from './constants'
import { visitSideWindow } from './utils/visitSideWindow'

context('Axe core RGAA check that ', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')
    cy.intercept('GET', '/bff/v1/dashboards').as('getDashboards')
    cy.viewport(1280, 1024)
  })

  it('Layer selector should respect RGAA criteria', () => {
    cy.visit('/#@-192242.97,5819420.73,9.93')
    cy.wait(['@getAmps', '@getRegulatoryAreas', '@getVigilanceAreas'])
    cy.clickButton('Arbre des couches')
    cy.injectAxe()
    // @ts-ignore
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: false }
      },
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    })
  })

  describe('Mission ', () => {
    it('list should respect RGAA criteria', () => {
      visitSideWindow()
      cy.wait('@getMissions')
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })

    it('with surveillance action opened should respect RGAA criteria', () => {
      visitSideWindow()
      cy.wait('@getMissions')
      cy.fill('Période', 'Année en cours')
      cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
      cy.getDataCy('action-card').eq(0).click()
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })

    it('with a control action opened should respect RGAA criteria', () => {
      visitSideWindow()
      cy.wait('@getMissions')
      cy.fill('Période', 'Année en cours')
      cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
      cy.getDataCy('action-card').eq(1).click()
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })

    it('with attached reporting should respect RGAA criteria', () => {
      visitSideWindow()
      cy.wait('@getMissions')
      cy.fill('Période', 'Année en cours')
      cy.injectAxe()
      cy.getDataCy('edit-mission-34').scrollIntoView().click({ force: true })
      cy.getDataCy('action-card').eq(2).click()
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })
  })

  describe('Vigilance area ', () => {
    it('form should respect RGAA criteria', () => {
      cy.visit('/#@-192242.97,5819420.73,9.93')
      cy.wait(['@getVigilanceAreas'])
      cy.clickButton('Arbre des couches')
      cy.getDataCy('vigilance-area-results-list-button').click()
      cy.clickButton('Zone de vigilance 1')
      cy.clickButton('Editer')
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })

    it('list should respect RGAA criteria', () => {
      visitSideWindow()
      cy.clickButton('Zones de vigilance')
      cy.wait(['@getVigilanceAreas'])
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })
  })
  describe('Reporting ', () => {
    it('list should respect RGAA criteria', () => {
      visitSideWindow()
      cy.clickButton('Signalements')
      cy.wait('@getReportings')
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })

    it('a reporting form should respect RGAA criteria', () => {
      cy.visit(`/`)
      cy.clickButton('Chercher des signalements')
      cy.clickButton('Ajouter un signalement')
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'] // RGAA s’appuie sur WCAG 2.1 A et AA
        }
      })
    })
  })

  describe('Dashboard ', () => {
    it('list should respect RGAA criteria', () => {
      visitSideWindow()
      cy.clickButton('Tableaux de bord')
      cy.wait(['@getDashboards'])
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })

    it('form should respect RGAA criteria', () => {
      visitSideWindow()
      cy.clickButton('Tableaux de bord')
      cy.wait(['@getDashboards'])
      const id = 'e2a7d0ae-55ff-4fd9-8a6d-88b92d2b1a42'
      cy.getDataCy(`edit-dashboard-${id}`).click({ force: true })

      // Tab should be visible
      cy.getDataCy('dashboard-1').contains('Dashboard 2')
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })
  })

  describe('Backoffice ', () => {
    it('administration list should respect RGAA criteria', () => {
      cy.visit(`/backoffice/administrations`)
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })
    it('control unit list should respect RGAA criteria', () => {
      cy.visit(`/backoffice/control_units`)
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })
    it('stations list should respect RGAA criteria', () => {
      cy.visit(`/backoffice/stations`)
      cy.injectAxe()
      // @ts-ignore
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })
  })
})
