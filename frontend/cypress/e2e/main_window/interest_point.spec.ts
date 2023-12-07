context('InterestPoint', () => {
  beforeEach(() => {
    cy.visit('/#@-824534.42,6082993.21,8.70')
  })

  it('An interest point Should be created When clicking on the map', () => {
    // When
    cy.getDataCy('interest-point').click()
    cy.get('#root').click(490, 580)

    // Then
    cy.getDataCy('interest-point-name-input').type('Phénomène')
    cy.getDataCy('interest-point-observations-input').type('Est dans la bergerie')

    cy.getDataCy('interest-point-name').first().contains('Phénomène')
    cy.getDataCy('interest-point-observations').first().contains('Est dans la bergerie')
    cy.getDataCy('interest-point-coordinates').first().contains('47° 4')
    cy.getDataCy('interest-point-coordinates').first().contains('N')
    cy.getDataCy('interest-point-coordinates').first().contains('007° 5')
    cy.getDataCy('interest-point-coordinates').first().contains('W')

    cy.getDataCy('interest-point-save').click()
  })

  it('Multiple interest points Should be created When clicking on the map', () => {
    // When
    cy.getDataCy('interest-point').click()
    cy.get('#root').click(490, 580)
    cy.getDataCy('interest-point-name-input').type('Phénomène')
    cy.getDataCy('interest-point-observations-input').type('Est dans la bergerie')
    cy.getDataCy('interest-point-save').click()
    cy.getDataCy('save-interest-point').should('be.visible')
    cy.getDataCy('interest-point-observations').eq(0).contains('Est dans la bergerie')
    cy.getDataCy('interest-point-observations').should('have.length', 1)

    cy.getDataCy('interest-point').click()
    cy.getDataCy('dms-coordinates-input').eq(1).should('have.value', '__° __′ __″ _ ___° __′ __″ _')
    cy.get('#root').click(300, 430)
    cy.getDataCy('interest-point-name-input').type('Phénomène 2')
    cy.getDataCy('interest-point-observations-input').type('Est encore dans la bergerie')
    cy.getDataCy('interest-point-save').click()
    cy.getDataCy('save-interest-point').should('be.visible')
    cy.getDataCy('interest-point-observations').should('have.length', 2)
    cy.getDataCy('interest-point-observations').eq(0).contains('Est encore dans la bergerie')

    cy.getDataCy('interest-point').click()
    cy.getDataCy('dms-coordinates-input').eq(1).should('have.value', '__° __′ __″ _ ___° __′ __″ _')
    cy.get('#root').click(650, 690)
    cy.getDataCy('interest-point-name-input').type('Phénomène 3')
    cy.getDataCy('interest-point-observations-input').type('Est encore encore dans la bergerie')
    cy.getDataCy('interest-point-save').click()
    cy.getDataCy('save-interest-point').should('be.visible')
    cy.getDataCy('interest-point-observations').should('have.length', 3)
    cy.getDataCy('interest-point-observations').eq(0).contains('Est encore encore dans la bergerie')
  })

  it('An interest Should be created from input When DD coordinates are selected', () => {
    // When
    cy.getDataCy('coordinates-selection').click({ force: true })
    cy.get('#root').click(159, 1000)
    cy.getDataCy('coordinates-selection-dd').click()
    cy.getDataCy('interest-point').click()

    // Then
    cy.getDataCy('coordinates-dd-input-lat').eq(1).type('47.5525')
    cy.getDataCy('coordinates-dd-input-lon').eq(1).type('-007.5563')

    cy.getDataCy('interest-point-name').first().contains('Aucun Libellé')
    cy.getDataCy('interest-point-observations').first().contains('Aucune observation')
    cy.getDataCy('interest-point-coordinates').first().contains('47.5525° -007.5563°')

    cy.getDataCy('interest-point-save').click()
    // Then
    cy.getDataCy('interest-point-coordinates').contains('47.5525° -007.5563°')
  })

  it('An interest Should be edited When DMD coordinates are selected', () => {
    // When
    cy.getDataCy('coordinates-selection').click({ force: true })
    cy.get('#root').click(159, 1000)
    cy.getDataCy('coordinates-selection-dmd').find('input').click({ force: true })
    cy.getDataCy('interest-point').click()
    cy.get('#root').click(490, 580)
    cy.getDataCy('interest-point-save').click()
    cy.getDataCy('interest-point-edit').click()
    cy.getDataCy('dmd-coordinates-input').eq(1).type('{backspace}{backspace}{backspace}{backspace}{backspace}500W')

    // Then
    cy.getDataCy('interest-point-coordinates').contains('47° 42.111′ N 007° 54.500′ W')
  })

  it('An interest Should be edited with East value When DMS coordinates are selected', () => {
    // When
    cy.getDataCy('coordinates-selection').click({ force: true })
    cy.get('#root').click(159, 1000)
    cy.getDataCy('interest-point').click()
    cy.get('#root').click(490, 580)
    cy.getDataCy('interest-point-type-radio-input').click()
    cy.getDataCy('interest-point-save').click()
    cy.get('[data-cy="interest-point-edit').click()
    // The interest point is moved to the East side
    cy.getDataCy('dms-coordinates-input').eq(1).type('{backspace}E')
    cy.getDataCy('interest-point-save').click()

    // Then
    cy.get('#root').click(536, 600)
    cy.getDataCy('save-interest-point').should('not.be.visible')

    cy.getDataCy('interest-point-edit').should('not.be.visible')
    cy.getDataCy('interest-point-edit').click({ force: true })
    cy.getDataCy('dms-coordinates-input').eq(1).should('have.value', '47° 45′ 31″ N 007° 54′ 51″ E')
    cy.getDataCy('interest-point-type-radio-input').should('have.class', 'rs-radio-checked')
    cy.getDataCy('interest-point-save').click({ timeout: 10000 })

    cy.getDataCy('interest-point-coordinates').first().contains('47° 45′')
    cy.getDataCy('interest-point-coordinates').first().contains('N')
    cy.getDataCy('interest-point-coordinates').first().contains('007° 54′')
    cy.getDataCy('interest-point-coordinates').first().contains('E')
  })

  it('An interest Should be deleted When it is in edit mode', () => {
    // When
    cy.getDataCy('interest-point').click()
    cy.get('#root').click(490, 580)
    cy.getDataCy('interest-point-save').click()
    cy.getDataCy('interest-point-edit').click()
    cy.getDataCy('interest-point-observations-input').type('Est dans la bergerie')
    cy.getDataCy('interest-point-delete').click()

    // Then
    cy.getDataCy('interest-point-coordinates').should('not.exist')
  })

  it('An interest in drawing mode Should be stopped When closing the interest point tool', () => {
    // When
    cy.getDataCy('interest-point').click()
    cy.wait(100)
    cy.get('body').type('{esc}')
    cy.wait(200)
    cy.get('#root').click(490, 580)
    cy.getDataCy('interest-point-save').should('not.be.visible')
    cy.getDataCy('interest-point-edit').should('not.exist')
  })
})
