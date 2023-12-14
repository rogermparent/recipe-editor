/*
 ** should display first three items
 **
 ** should link to index when there are more than three items
 ** should not need authorization
 */

import { checkTitlesInOrder } from "./util";

describe("Post", () => {
  describe("with the two posts fixture", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("http://localhost:3000/post/post-5");
    });

    it("should display a post", () => {
      cy.findByText("Post 5");
    });

    it("should not need authorization", () => {
      cy.visit("http://localhost:3000/post/post-5");
      cy.findByText("Log In");
    });

    it("should be able to edit the post", () => {
      cy.findByText("Delete").click();

      cy.findByText("Post 3");
      checkTitlesInOrder(["Post 6", "Post 4", "Post 3"]);
    });

    it("should be able to delete the post", () => {
      cy.findByText("Delete").click();

      cy.findByText("Post 3");
      checkTitlesInOrder(["Post 6", "Post 4", "Post 3"]);
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
