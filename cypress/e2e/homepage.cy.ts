function checkTitlesInOrder(titles) {
  const items = cy.findAllByRole("listitem");
  items.should("have.length", titles.length);
  items.each((el, i) => cy.wrap(el).findByText(titles[i]));
}

describe("Homepage", () => {
  it("should have no items to start", () => {
    cy.resetData();
    cy.visit("http://localhost:3000");
    cy.findByText("There are no posts yet.");
  });

  it("should be able to create and delete a new post", () => {
    cy.resetData();
    cy.visit("http://localhost:3000");
    const testTitle = "Test Title";

    // We should start with no posts
    cy.findByText("There are no posts yet.");
    cy.findAllByText(testTitle).should("not.exist");
    cy.findByLabelText("Title").type(testTitle);
    cy.findByText("Post").click();
    cy.findByText(testTitle);

    // Check home and ensure the post is present
    cy.visit("http://localhost:3000");
    cy.findByText(testTitle);

    // Delete the post and ensure it's gone
    cy.findByText("Delete").click();
    cy.findAllByText(testTitle).should("not.exist");
  });

  it("should be able to post and see those posts in chronological order", () => {
    cy.resetData();
    cy.visit("http://localhost:3000");
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

  it("should properly display the two-page fixture", () => {
    cy.resetData("two-pages");
    cy.visit("http://localhost:3000");

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

  it("should be able to delete items", () => {
    cy.resetData("two-pages");
    cy.visit("http://localhost:3000");

    checkTitlesInOrder(["Post 6", "Post 5", "Post 4"]);
    cy.findAllByRole("listitem");
    cy.findByText("Post 5")
      .parents("li")
      .first()
      .within(() => {
        cy.findByText("Delete").click();
      });

    cy.findByText("Post 3");
    checkTitlesInOrder(["Post 6", "Post 4", "Post 3"]);
  });
});
