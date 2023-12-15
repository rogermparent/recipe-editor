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

    it("should be able to go to the edit page", () => {
      cy.findByText("Edit").click();

      cy.fillLoginForm();

      cy.findByText("Editing post: Post 5");
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
