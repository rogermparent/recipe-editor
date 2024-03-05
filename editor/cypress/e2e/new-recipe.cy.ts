describe("New Recipe View", () => {
  describe("with the importable uploads fixture", () => {
    beforeEach(() => {
      cy.resetData("importable-uploads");
      cy.visit("/new-recipe");
    });

    it("should need authentication", () => {
      cy.findByText("Sign in with Credentials");
    });

    describe("when authenticated", () => {
      beforeEach(() => {
        cy.fillSignInForm();
      });

      it("should be able to create a new recipe", () => {
        cy.findByRole("heading", { name: "New Recipe" });

        const newRecipeTitle = "My New Recipe";

        cy.findAllByLabelText("Name").first().clear().type(newRecipeTitle);

        cy.findByText("Submit").click();

        cy.findByRole("heading", { name: newRecipeTitle });

        cy.visit("/");

        cy.findByText(newRecipeTitle);

        cy.checkNamesInOrder([newRecipeTitle]);
      });

      it("should be able to import a recipe", () => {
        const baseURL = Cypress.config().baseUrl;
        const testURL = "/uploads/katsudon.html";
        const fullTestURL = new URL(testURL, baseURL);
        cy.findByLabelText("Import from URL").type(fullTestURL.href);
        cy.findByRole("button", { name: "Import" }).click();
        cy.url().should(
          "equal",
          new URL(
            "/new-recipe?import=http%3A%2F%2Flocalhost%3A3000%2Fuploads%2Fkatsudon.html",
            baseURL,
          ).href,
        );

        // Stay within the recipe form to minimize matching outside
        cy.get("#recipe-form").within(() => {
          // Verify top-level fields, i.e. name and description
          cy.get('[name="name"]').should("have.value", "Katsudon");
          cy.get('[name="description"]').should(
            "have.value",
            "*Imported from [http://localhost:3000/uploads/katsudon.html](http://localhost:3000/uploads/katsudon.html)*\n\n---\n\nKatsudon is a Japanese pork cutlet rice bowl made with tonkatsu, eggs, and sautéed onions simmered in a sweet and savory sauce. It‘s a one-bowl wonder and true comfort food!",
          );

          // Verify first ingredient
          cy.get('[name="ingredients[0].ingredient"]').should(
            "have.value",
            `<Multiplyable baseNumber="1" /> cup water ((for the dashi packet))`,
          );

          // Verify first instruction, which is a simple step
          cy.get('[name="instructions[0].type"]').should("have.value", "step");
          cy.get('[name="instructions[0].name"]').should("have.value", "");
          cy.get('[name="instructions[0].text"]').should(
            "have.value",
            "Before You Start: Gather all the ingredients. For the steamed rice, please note that 1½ cups (300 g, 2 rice cooker cups) of uncooked Japanese short-grain rice yield 4⅓ cups (660 g) of cooked rice, enough for 2 donburi servings (3⅓ cups, 500 g). See how to cook short-grain rice with a rice cooker, pot over the stove, Instant Pot, or donabe.",
          );

          // Verify second instruction, which is a group
          cy.get('[name="instructions[1].type"]').should("have.value", "group");
          cy.get('[name="instructions[1].name"]').should(
            "have.value",
            "To Make the Dashi",
          );
          cy.get('[name="instructions[1].text"]').should("not.exist");
        });
      });
    });
  });
});
