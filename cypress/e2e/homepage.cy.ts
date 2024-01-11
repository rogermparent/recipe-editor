describe("Index Page", () => {
  describe("when empty", () => {
    beforeEach(() => {
      cy.resetData();
      cy.visit("http://localhost:3000");
    });

    it("should not need authorization", () => {
      cy.findByText("Sign In");
    });

    it("should inform the user if there are no recipes", () => {
      cy.findByText("There are no recipes yet.");
    });

    it("should be able to create and delete a recipe", () => {
      const testRecipe = "Test Recipe";

      // We should start with no recipes
      cy.findByText("There are no recipes yet.");
      cy.findAllByText(testRecipe).should("not.exist");

      cy.findByText("New Recipe").click();

      cy.fillSignInForm();

      cy.findByLabelText("Name").type(testRecipe);
      cy.findByText("Submit").click();
      cy.findByText(testRecipe);

      // Check home and ensure the recipe is present
      cy.visit("http://localhost:3000");
      cy.findByText(testRecipe).click();

      // Delete the recipe and ensure it's gone
      cy.findByText("Delete").click();
      cy.findAllByText(testRecipe).should("not.exist");

      cy.request({
        url: "http://localhost:3000/recipe/test-page",
        failOnStatusCode: false,
      })
        .its("status")
        .should("equal", 404);
    });

    it("should be able to create recipes and see them in chronological order", () => {
      cy.findByText("Sign In").click();

      cy.fillSignInForm();

      const testNames = ["c", "a", "1"].map((x) => `Recipe ${x}`);
      for (const testRecipe of testNames) {
        cy.visit("http://localhost:3000/new-recipe");
        cy.findByLabelText("Name").type(testRecipe);
        cy.findByText("Submit").click();
        cy.findByText(testRecipe);
      }

      cy.visit("http://localhost:3000");
      cy.checkNamesInOrder(testNames.reverse());
    });
  });

  describe("with just enough items for the front page", () => {
    beforeEach(() => {
      cy.resetData("front-page-only");
      cy.visit("http://localhost:3000");
    });

    it("should not display a link to the index", () => {
      const allNames = [3, 2, 1].map((x) => `Recipe ${x}`);

      // Homepage should have latest three recipes
      cy.checkNamesInOrder(allNames);

      cy.findAllByText("More").should("not.exist");
    });
  });

  describe("with two pages of items", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("http://localhost:3000");
    });

    it("should display the latest three recipes", () => {
      const allNames = [7, 6, 5, 4, 3, 2, 1].map((x) => `Recipe ${x}`);

      // Homepage should have latest three recipes
      cy.checkNamesInOrder(allNames.slice(0, 3));

      // First page should have latest 6 recipes
      cy.findByText("More").click();
      cy.checkNamesInOrder(allNames.slice(0, 6));

      // Second page should have the last one recipe
      cy.findByText("→").click();
      cy.checkNamesInOrder(allNames.slice(6));
    });
  });
});
