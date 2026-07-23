export function createRegulatoryArea(id: string, title: string = 'Nouvelle zone réglementaire') {
  cy.fill('Titre de la zone réglementaire', title)
  cy.fill('Géométrie', id)
  cy.fill('Façade', 'NAMO')
  cy.fill('Type d’acte administratif', 'Arrêté inter-préfectoral')
  cy.fill('Tags et sous-tags', ['AMP'])
  cy.fill('Thématiques et sous-thématiques', ['Réglementation de la réserve naturelle'])
  cy.fill('Résumé', 'Résumé de la nouvelle zone réglementaire')
  cy.get('#PIRCType').click()
  cy.fill('URL du lien', 'https://www.google.com')
}
