describe("Single Recipe View", () => {
  describe("with seven items", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("/recipe/recipe-6");
    });

    it("should display a recipe", () => {
      cy.findByText("Recipe 6");
    });

    it("should not need authorization", () => {
      cy.findByText("Sign In");
    });

    it("should be able to edit a recipe", () => {
      cy.findByText("Edit").click();

      cy.fillSignInForm();

      cy.findByText("Editing Recipe: Recipe 6");

      cy.findByText("Advanced").click();

      const editedRecipe = "Edited Recipe";

      cy.findAllByLabelText("Name").first().clear().type(editedRecipe);

      const recipeDate = "2023-12-08T01:16:12.622";
      cy.findByLabelText("Date (UTC)").should("have.value", recipeDate);

      cy.findByText("Submit").click();

      cy.findByText(editedRecipe);

      cy.visit("/");
      cy.findByText(editedRecipe);
      cy.checkNamesInOrder([
        "Recipe 7",
        editedRecipe,
        "Recipe 5",
        "Recipe 4",
        "Recipe 3",
        "Recipe 2",
      ]);

      // Recipe date should not have changed
      cy.findByText(new Date(recipeDate + "Z").toLocaleString());
    });

    it("should be able to delete the recipe", () => {
      cy.findByText("Delete").click();

      // First click of the delete button should trigger a sign-in
      cy.fillSignInForm();

      cy.findByText("Delete").click();

      cy.findByText("Recipe 4");
      cy.checkNamesInOrder([
        "Recipe 7",
        "Recipe 5",
        "Recipe 4",
        "Recipe 3",
        "Recipe 2",
        "Recipe 1",
      ]);
      cy.request({
        url: "/recipe/recipe-6",
        failOnStatusCode: false,
      })
        .its("status")
        .should("equal", 404);
    });
  });

  it("should have status 404 when recipe doesn't exist", () => {
    cy.request({
      url: "/recipe/non-existent-recipe",
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 404);
  });
});
