import simpleGit from "simple-git";

describe("Git content", () => {
  describe("when empty", () => {
    beforeEach(() => {
      cy.resetData();
      cy.initializeContentGit();
      cy.visit("/");
    });

    it("should be able to create recipes and see them in chronological order", () => {
      cy.getContentGitLog().should("have.ordered.members", ["Initial Commit"]);
      cy.findByText("Sign In").click();

      cy.fillSignInForm();

      const testNames = ["c", "a"].map((x) => `Recipe ${x}`);
      for (const testRecipe of testNames) {
        cy.visit("/new-recipe");
        cy.findByLabelText("Name").type(testRecipe);
        cy.findByText("Submit").click();
        cy.findByText(testRecipe);
      }

      cy.findByText("Edit").click();
      const editedTestName = "edited";
      cy.findAllByLabelText("Name").first().clear();
      cy.findAllByLabelText("Name").first().type(editedTestName);
      cy.findByText("Submit").click();
      cy.findByText(editedTestName);

      cy.visit("/");
      cy.findByText("Recipe c").click();
      cy.findByText("Delete").click();

      cy.findByText(editedTestName);

      cy.getContentGitLog().should("have.ordered.members", [
        "Delete recipe: recipe-c",
        "Update recipe: recipe-a",
        "Add new recipe: recipe-a",
        "Add new recipe: recipe-c",
        "Initial Commit",
      ]);

      cy.visit("/");
      cy.checkNamesInOrder([editedTestName]);
    });
  });
});
