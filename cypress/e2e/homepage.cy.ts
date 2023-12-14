import { checkTitlesInOrder, fillLoginForm } from "./util";

describe("Homepage", () => {
  describe("when empty", () => {
    beforeEach(() => {
      cy.resetData();
      cy.visit("http://localhost:3000");
    });
    it("should not need authorization", () => {
      cy.findByText("Sign In");
    });
    it("should inform the user if there are no posts", () => {
      cy.findByText("There are no posts yet.");
    });

    it("should be able to create and delete a post", () => {
      const testTitle = "Test Title";

      // We should start with no posts
      cy.findByText("There are no posts yet.");
      cy.findAllByText(testTitle).should("not.exist");

      cy.findByText("New Post").click();

      fillLoginForm();

      cy.findByLabelText("Title").type(testTitle);
      cy.findByText("Post").click();
      cy.findByText(testTitle);

      // Check home and ensure the post is present
      cy.visit("http://localhost:3000");
      cy.findByText(testTitle).click();

      // Delete the post and ensure it's gone
      cy.findByText("Delete").click();
      cy.findAllByText(testTitle).should("not.exist");

      cy.request({
        url: "http://localhost:3000/post/test-title",
        failOnStatusCode: false,
      })
        .its("status")
        .should("equal", 404);
    });

    it("should be able to post and see those posts in chronological order", () => {
      const testTitles = ["c", "a", "1"].map((x) => `Post ${x}`);
      for (const testTitle of testTitles) {
        cy.visit("http://localhost:3000");
        cy.findByLabelText("Title").type(testTitle);
        cy.findByText("Post").click();
        cy.findByText(testTitle);
      }

      cy.visit("http://localhost:3000");
      const frontPagePosts = cy.findAllByText(/Post ./);
      frontPagePosts.should("have.length", 3);
      frontPagePosts.each((el, i) => {
        cy.wrap(el).should("have.text", testTitles[testTitles.length - 1 - i]);
      });
    });
  });

  describe("with only enough items for the front page", () => {
    beforeEach(() => {
      cy.resetData("front-page-only");
      cy.visit("http://localhost:3000");
    });

    it.only("should not display a link to the index", () => {
      const allTitles = [3, 2, 1].map((x) => `Post ${x}`);

      // Homepage should have latest three posts
      checkTitlesInOrder(allTitles);

      cy.findAllByText("More").should("not.exist");
    });
  });

  describe("with two pages of items", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("http://localhost:3000");
    });

    it.only("should display the latest three posts", () => {
      const allTitles = [6, 5, 4, 3, 2, 1].map((x) => `Post ${x}`);

      // Homepage should have latest three posts
      checkTitlesInOrder(allTitles.slice(0, 3));

      // First page should have latest 5 posts
      cy.findByText("More").click();
      checkTitlesInOrder(allTitles.slice(0, 5));

      // Second page should have the last one post
      cy.findByText("→").click();
      checkTitlesInOrder(allTitles.slice(5));
    });
  });
});
