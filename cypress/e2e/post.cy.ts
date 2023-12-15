describe("Single Post View", () => {
  describe("with the two posts fixture", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("http://localhost:3000/post/post-5");
    });

    it("should display a post", () => {
      cy.findByText("Post 5");
    });

    it("should not need authorization", () => {
      cy.findByText("Log In");
    });

    it("should be able to edit a post", () => {
      cy.findByText("Edit").click();

      cy.fillLoginForm();

      cy.findByText("Editing post: Post 5");

      cy.findByText("Advanced").click();

      const editedTitle = "Edited Title";

      cy.findByLabelText("Title").clear().type(editedTitle);

      const postDate = "2023-12-08T01:16:07.582";
      cy.findByLabelText("Date (UTC)").should("have.value", postDate);

      cy.findByText("Submit").click();

      cy.findByText(editedTitle);

      cy.visit("http://localhost:3000/");
      cy.checkTitlesInOrder(["Post 6", editedTitle, "Post 4"]);

      // Post date should not have changed
      cy.findByText(new Date(postDate + "Z").toLocaleString());
    });

    it("should be able to delete the post", () => {
      cy.findByText("Delete").click();

      // First click of the delete button should trigger a sign-in
      cy.fillLoginForm();

      cy.findByText("Delete").click();

      cy.findByText("Post 3");
      cy.checkTitlesInOrder(["Post 6", "Post 4", "Post 3"]);
      cy.request({
        url: "http://localhost:3000/post/post-5",
        failOnStatusCode: false,
      })
        .its("status")
        .should("equal", 404);
    });
  });

  it("should have status 404 when post doesn't exist", () => {
    cy.request({
      url: "http://localhost:3000/post/non-existent-post",
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 404);
  });
});
