context('Mission', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('A mission should be created', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.wrap(numberOfMissions).as('numberOfMissions')
    })

    cy.get('*[data-cy="add-mission"]').click()

    cy.get('form').submit()
    cy.wait(100)
    cy.get('*[data-cy="mission-errors"]').should('exist')

    // When
    cy.fill('Début de mission (UTC)', [2024, 5, 26, 12, 0])

    // with wrong end date of mission
    cy.fill('Fin de mission (UTC)', [2024, 5, 25, 14, 15])
    cy.get('form').submit()
    cy.wait(100)
    cy.get('.Element-FieldError').contains('La date de fin doit être postérieure à la date de début')

    // with good date
    cy.fill('Fin de mission (UTC)', [2024, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })
    cy.get('[name="missionTypes1"]').click({ force: true })

    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')

    cy.get('[name="openBy"]').scrollIntoView().type('PCF')

    cy.intercept('PUT', '/bff/v1/missions').as('createMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@createMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      expect(request.body.missionTypes.length).equal(2)
      expect(request.body.missionTypes[0]).equal('SEA')
      expect(request.body.missionTypes[1]).equal('LAND')
      expect(request.body.controlUnits.length).equal(1)
      const controlUnit = request.body.controlUnits[0]
      expect(controlUnit.administration).equal('DIRM / DM')
      expect(controlUnit.id).equal(10011)
      expect(controlUnit.name).equal('Cross Etel')
    })
    cy.wait('@getMissions')
    cy.wait(500)
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.get('@numberOfMissions').then(numberOfMissionsBefore => {
        expect(numberOfMissions).equal(parseInt(numberOfMissionsBefore as unknown as string, 10) + 1)
      })
    })
  })

  it('A mission should be deleted', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.wrap(numberOfMissions).as('numberOfMissions')
    })

    cy.get('*[data-cy="edit-mission-49"]').click({ force: true })

    cy.intercept({
      url: `/bff/v1/missions*`
    }).as('deleteMission')
    cy.get('*[data-cy="delete-mission"]').click()
    cy.get('*[name="delete-mission-modal-cancel"]').click()
    cy.get('*[data-cy="delete-mission"]').click()
    cy.get('*[name="delete-mission-modal-confirm"]').click()

    // Then
    cy.wait('@deleteMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
    })
    cy.wait('@getMissions')
    cy.wait(500)
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').then($el => {
      const numberOfMissions = parseInt($el.text(), 10)
      cy.get('@numberOfMissions').then(numberOfMissionsBefore => {
        expect(numberOfMissions).equal(parseInt(numberOfMissionsBefore as unknown as string, 10) - 1)
      })
    })
  })

  it('A closed mission should be reopenable, editable and saved again', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="edit-mission-25"]').click({ force: true })
    cy.intercept('PUT', `/bff/v1/missions/25`).as('updateMission')

    cy.get('*[data-cy="reopen-mission"]').click()
    cy.get('*[data-cy="control-unit-contact"]').type('Contact 012345')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.isClosed).equal(false)
    })
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')
  })

  it('A mission can be closed without contact', () => {
    // Given
    cy.wait(200)
    cy.get('*[data-cy="edit-mission-43"]').click({ force: true })
    cy.intercept('PUT', '/bff/v1/missions/43').as('updateMission')

    cy.fill("Contact de l'unité 1", '')
    cy.wait(300)
    cy.clickButton('Enregistrer et clôturer')
    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)
      expect(request.body.controlUnits[0].contact).equal(undefined)
    })
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')
  })

  it('A mission from monitorFish cannot be deleted', () => {
    // Given
    cy.wait(200)

    cy.get('*[data-cy="select-period-filter"]').click()
    cy.get('div[data-key="MONTH"]').click()

    cy.get('*[data-cy="edit-mission-50"]').click({ force: true })

    // Then
    cy.get('*[data-cy="delete-mission"]').should('be.disabled')
  })

  it('A warning should be displayed When a control unit is already engaged in a mission ', () => {
    // Given
    cy.wait(200)
    cy.intercept('GET', '/api/v1/missions/engaged_control_units').as('getEngagedControlUnits')

    // When
    cy.get('*[data-cy="edit-mission-43"]').click({ force: true })
    cy.wait('@getEngagedControlUnits')

    // Then
    cy.get('body').contains('Cette unité est actuellement sélectionnée dans une autre mission en cours.')
  })
})
