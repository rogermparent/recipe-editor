describe("Index Page", () => {
  describe("when empty", () => {
    beforeEach(() => {
      cy.resetData();
      cy.visit("http://localhost:3000");
    });

    it("should not need authorization", () => {
      cy.findByText("Sign In");
    });

    it("should inform the user if there are no docs", () => {
      cy.findByText("There are no docs yet.");
    });

    it("should be able to create and delete a docPage", () => {
      const testPage = "Test Page";

      // We should start with no docPages
      cy.findByText("There are no docs yet.");
      cy.findAllByText(testPage).should("not.exist");

      cy.findByText("New Doc").click();

      cy.fillSignInForm();

      cy.findByLabelText("Name").type(testPage);
      cy.findByText("Submit").click();
      cy.findByText(testPage);

      // Check home and ensure the docPage is present
      cy.visit("http://localhost:3000");
      cy.findByText(testPage).click();

      // Delete the docPage and ensure it's gone
      cy.findByText("Delete").click();
      cy.findAllByText(testPage).should("not.exist");

      cy.request({
        url: "http://localhost:3000/docPage/test-page",
        failOnStatusCode: false,
      })
        .its("status")
        .should("equal", 404);
    });

    it("should be able to create docPages and see them in chronological order", () => {
      cy.findByText("Sign In").click();

      cy.fillSignInForm();

      const testCompanies = ["c", "a", "1"].map((x) => `Page ${x}`);
      for (const testPage of testCompanies) {
        cy.visit("http://localhost:3000/new-docPage");
        cy.findByLabelText("Name").type(testPage);
        cy.findByText("Submit").click();
        cy.findByText(testPage);
      }

      cy.visit("http://localhost:3000");
      cy.checkCompaniesInOrder(testCompanies.reverse());
    });
  });

  describe("with only enough items for the front page", () => {
    beforeEach(() => {
      cy.resetData("front-page-only");
      cy.visit("http://localhost:3000");
    });

    it("should not display a link to the index", () => {
      const allCompanies = [3, 2, 1].map((x) => `Page ${x}`);

      // Homepage should have latest three docPages
      cy.checkCompaniesInOrder(allCompanies);

      cy.findAllByText("More").should("not.exist");
    });
  });

  describe("with two pages of items", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("http://localhost:3000");
    });

    it("should display the latest three docPages", () => {
      const allCompanies = [6, 5, 4, 3, 2, 1].map((x) => `Page ${x}`);

      // Homepage should have latest three docPages
      cy.checkCompaniesInOrder(allCompanies.slice(0, 3));

      // First page should have latest 5 docPages
      cy.findByText("More").click();
      cy.checkCompaniesInOrder(allCompanies.slice(0, 5));

      // Second page should have the last one docPage
      cy.findByText("→").click();
      cy.checkCompaniesInOrder(allCompanies.slice(5));
    });
  });
});
