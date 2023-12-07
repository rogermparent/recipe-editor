describe("example to-do app", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("has a title", () => {
    cy.get("h1").should("have.length", 1);
  });
});
