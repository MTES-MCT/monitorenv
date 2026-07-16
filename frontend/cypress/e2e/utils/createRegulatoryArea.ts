export function createRegulatoryArea(groupName: string = 'RNN Iroise', title: string = 'Nouvelle zone réglementaire') {
  cy.fill('Titre de la zone réglementaire', title)
  cy.fill('Groupe de réglementation', groupName)
  cy.fill('Géométrie', '123')
  cy.fill('Façade', 'NAMO')
  cy.fill('Type d’acte administratif', 'Arrêté inter-préfectoral')
  cy.fill('Tags et sous-tags', ['AMP'])
  cy.fill('Résumé', 'Résumé de la nouvelle zone réglementaire')
  cy.get('#PIRCType').click()

  cy.fill('URL du lien', 'https://www.google.com')
}
