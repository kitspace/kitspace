describe('Smoke Test', () => {
  const boardsPath = './build/.temp/boards.json'

  before(() => {
    cy.visit('/')
  })

  it('checks that boards are rendered to screen', () => {
    cy.get('div.boardList').as('boardList')
    cy.scrollTo('bottom')

    cy.get('@boardList').should('have.length.above', 0)
  })

  it('assert the number of boards equal boards in `boards.json`', () => {
    cy.get('div.boardList').as('boardList')

    cy.readFile(boardsPath).then(boards => {
      cy.get('@boardList')
        .children()
        .should('have.length', boards.length)
    })
  })
})
