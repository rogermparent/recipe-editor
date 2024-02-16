describe("Search Page", () => {
  describe("with seven items", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("/search");
    });

    it("should not need authorization", () => {
      cy.findByText("Sign In");
    });

    it("should be able to find a single recipe by name", () => {
      cy.findByLabelText("Query").type("Recipe 6");
      cy.findByRole("button", { name: "Submit" }).click();

      cy.findByRole("listitem")
        .findByRole("heading")
        .should("have.text", "Recipe 6");

      cy.findByLabelText("Query").clear().type("6 Recipe");
      cy.findByRole("button", { name: "Submit" }).click();

      cy.findByRole("listitem")
        .findByRole("heading")
        .should("have.text", "Recipe 6");

      cy.findByLabelText("Query").clear().type("recipe 6");
      cy.findByRole("button", { name: "Submit" }).click();

      cy.findByRole("listitem")
        .findByRole("heading")
        .should("have.text", "Recipe 6");

      cy.findByLabelText("Query").clear().type("6");
      cy.findByRole("button", { name: "Submit" }).click();

      cy.findByRole("listitem")
        .findByRole("heading")
        .should("have.text", "Recipe 6");

      cy.findByLabelText("Query").clear().type("5");
      cy.findByRole("button", { name: "Submit" }).click();

      cy.findByRole("listitem")
        .findByRole("heading")
        .should("have.text", "Recipe 5");
    });
  });
});
