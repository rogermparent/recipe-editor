describe("Recipe Edit View", () => {
  describe("with the two pages fixture", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("/recipe/recipe-6/edit");
    });

    it("should need authorization", () => {
      cy.findByText("Sign in with Credentials");
    });

    it("should require authorization even when recipe doesn't exist", () => {
      cy.visit({
        url: "/recipe/non-existent-recipe/edit",
      });
    });

    describe("when authenticated", () => {
      beforeEach(() => {
        cy.fillSignInForm();
      });

      it("should be able to edit a recipe", () => {
        cy.findByText("Editing Recipe: Recipe 6");

        cy.findByText("Advanced").click();

        const editedRecipeTitle = "Edited Recipe";

        cy.findAllByLabelText("Name").first().clear().type(editedRecipeTitle);

        const recipeDate = "2023-12-08T01:16:12.622";
        cy.findByLabelText("Date (UTC)").should("have.value", recipeDate);

        cy.findByText("Submit").click();

        cy.findByText(editedRecipeTitle);

        cy.visit("/");
        cy.findByText(editedRecipeTitle);
        cy.checkNamesInOrder(["Recipe 7", editedRecipeTitle, "Recipe 5"]);

        // Recipe date should not have changed
        cy.findByText(new Date(recipeDate + "Z").toLocaleString());
      });

      it("should be able to set a recipe image over another image", () => {
        cy.findByText("Editing Recipe: Recipe 6");

        // Image preview should be current image
        cy.findByRole("img").should(
          "have.attr",
          "src",
          "/_next/image?url=%2Frecipe%2Frecipe-6%2Fuploads%2Frecipe%206%20test%20image.png&w=1920&q=75",
        );

        cy.findByLabelText("Image").selectFile(
          "cypress/fixtures/images/recipe 6 test image alternate.png",
        );

        // Image preview should now be blob from pending image
        cy.findByRole("img")
          .should("have.attr", "src")
          .should("match", /^blob:/);

        cy.findByText("Submit").click();

        // Image on view page should be alternate
        cy.findByRole("img").should(
          "have.attr",
          "src",
          "/_next/image?url=%2Frecipe%2Frecipe-6%2Fuploads%2Frecipe%206%20test%20image%20alternate.png&w=1920&q=75",
        );

        // Image on index should be alternate
        cy.visit("/");
        cy.findByText("Recipe 6")
          .parentsUntil("li")
          .findByRole("img")
          .should(
            "have.attr",
            "src",
            "/_next/image?url=%2Frecipe%2Frecipe-6%2Fuploads%2Frecipe%206%20test%20image%20alternate.png&w=828&q=75",
          );
      });

      it("should be able to set a recipe image on a recipe without an image", () => {
        cy.visit("/recipe/recipe-5/edit");
        cy.findByText("Editing Recipe: Recipe 5");

        // With no image, the preview and "remove image" checkbox should not be present
        cy.findAllByRole("img").should("not.exist");
        cy.findAllByLabelText("Remove Image").should("not.exist");

        cy.findByLabelText("Image").selectFile(
          "cypress/fixtures/images/recipe 6 test image alternate.png",
        );

        // Image preview should now be blob from pending image
        cy.findByRole("img")
          .should("have.attr", "src")
          .should("match", /^blob:/);

        cy.findAllByLabelText("Remove Image").should("not.exist");

        cy.findByText("Submit").click();

        // Image on view page should be alternate
        cy.findByRole("img").should(
          "have.attr",
          "src",
          "/_next/image?url=%2Frecipe%2Frecipe-5%2Fuploads%2Frecipe%206%20test%20image%20alternate.png&w=1920&q=75",
        );

        // Image on index should be alternate
        cy.visit("/");
        cy.findByText("Recipe 5")
          .parentsUntil("li")
          .findByRole("img")
          .should(
            "have.attr",
            "src",
            "/_next/image?url=%2Frecipe%2Frecipe-5%2Fuploads%2Frecipe%206%20test%20image%20alternate.png&w=828&q=75",
          );
      });

      it("should be able to remove an image", () => {
        cy.findByText("Editing Recipe: Recipe 6");

        cy.findByRole("img");

        cy.findByLabelText("Remove Image").click();

        cy.findByText("Submit").click();

        cy.findByText("Edit").click();

        // With no image, the preview and "remove image" checkbox should not be present
        cy.findAllByRole("img").should("not.exist");
        cy.findAllByLabelText("Remove Image").should("not.exist");
      });

      it("should be able to preserve an image when editing", () => {
        cy.findByText("Editing Recipe: Recipe 6");

        cy.findByRole("img");

        const editedRecipeTitle = "Edited Recipe";

        cy.findAllByLabelText("Name").first().clear().type(editedRecipeTitle);

        cy.findByText("Submit").click();

        cy.findByText(editedRecipeTitle);

        cy.findByText("Edit").click();

        cy.findByRole("img");
        cy.findByLabelText("Remove Image");
      });

      it("should have status 404 when recipe doesn't exist", () => {
        cy.request({
          url: "/recipe/non-existent-recipe/edit",
          failOnStatusCode: false,
        })
          .its("status")
          .should("equal", 404);
      });
    });
  });
});