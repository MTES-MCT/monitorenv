context('Mission', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('A control can be attached to a reporting', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-38').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('control-form-toggle-reporting').click({ force: true })
    cy.fill('Signalements', '8')

    cy.getDataCy('control-attached-reporting-tag').should('be.visible')
    cy.getDataCy('reporting-status-action-tag').should('have.length', 1)
    cy.getDataCy('reporting-status-action-tag').contains('Contrôle fait')

    cy.intercept('PUT', `/bff/v1/missions/38`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const controlWithAttachedReporting = response?.body.envActions.find(
        action => action.id === 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'
      )
      const attachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 8)

      expect(controlWithAttachedReporting.reportingIds.length).equal(1)
      expect(controlWithAttachedReporting.reportingIds[0]).equal(8)
      expect(attachedReporting.attachedEnvActionId).equal('f3e90d3a-6ba4-4bb3-805e-d391508aa46d')
    })
  })

  it('A control can be detached to a reporting', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-38').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('control-form-toggle-reporting').click({ force: true })

    cy.getDataCy('control-attached-reporting-tag').should('not.exist')
    cy.getDataCy('reporting-control-done').should('not.exist')

    cy.intercept('PUT', `/bff/v1/missions/38`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const controlWithAttachedReporting = response?.body.envActions.find(
        action => action.id === 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'
      )
      const attachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 8)

      expect(controlWithAttachedReporting.reportingIds.length).equal(0)
      expect(attachedReporting.attachedEnvActionId).equal(null)
    })
  })

  it('A surveillance can be attached to multiple reportings', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-53').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('surveillance-form-toggle-reporting').click({ force: true })

    cy.fill('Signalements', ['9'])

    cy.getDataCy('surveillance-attached-reportings-tags').should('exist')
    cy.getDataCy('reporting-status-action-tag').should('have.length', 2)
    cy.getDataCy('reporting-status-action-tag').contains('Surveillance faite')

    cy.fill('Signalements', ['9', '11'])
    cy.getDataCy('reporting-status-action-tag').should('have.length', 3)
    cy.intercept('PUT', `/bff/v1/missions/53`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const surveillanceWithAttachedReportings = response?.body.envActions.find(
        action => action.id === '9969413b-b394-4db4-985f-b00743ffb833'
      )
      const firstAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 9)
      const secondAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 11)

      expect(surveillanceWithAttachedReportings.reportingIds.length).equal(2)
      expect(firstAttachedReporting.attachedEnvActionId).equal('9969413b-b394-4db4-985f-b00743ffb833')
      expect(secondAttachedReporting.attachedEnvActionId).equal('9969413b-b394-4db4-985f-b00743ffb833')
    })
  })
  it('A surveillance can be detached to reportings', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-53').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()

    cy.getDataCy('surveillance-form-toggle-reporting').click({ force: true })

    cy.getDataCy('surveillance-attached-reportings-tags').should('not.exist')
    cy.getDataCy('reporting-status-action-tag').should('have.length', 1)

    cy.intercept('PUT', `/bff/v1/missions/53`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const surveillanceWithAttachedReportings = response?.body.envActions.find(
        action => action.id === '9969413b-b394-4db4-985f-b00743ffb833'
      )
      const firstAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 9)
      const secondAttachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 11)

      expect(surveillanceWithAttachedReportings.reportingIds.length).equal(0)
      expect(firstAttachedReporting.attachedEnvActionId).equal(null)
      expect(secondAttachedReporting.attachedEnvActionId).equal(null)
    })
  })
})
