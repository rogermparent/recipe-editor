describe("Index Page", () => {
  describe("when empty", () => {
    beforeEach(() => {
      cy.resetData();
      cy.visit("http://localhost:3000");
    });

    it("should not need authorization", () => {
      cy.findByText("Sign In");
    });

    it("should inform the user if there are no resumes", () => {
      cy.findByText("There are no resumes yet.");
    });

    it("should be able to create and delete a resume", () => {
      const testTitle = "Test Title";

      // We should start with no resumes
      cy.findByText("There are no resumes yet.");
      cy.findAllByText(testTitle).should("not.exist");

      cy.findByText("New Resume").click();

      cy.fillSignInForm();

      cy.findByLabelText("Title").type(testTitle);
      cy.findByText("Resume").click();
      cy.findByText(testTitle);

      // Check home and ensure the resume is present
      cy.visit("http://localhost:3000");
      cy.findByText(testTitle).click();

      // Delete the resume and ensure it's gone
      cy.findByText("Delete").click();
      cy.findAllByText(testTitle).should("not.exist");

      cy.request({
        url: "http://localhost:3000/resume/test-title",
        failOnStatusCode: false,
      })
        .its("status")
        .should("equal", 404);
    });

    it("should be able to resume and see those resumes in chronological order", () => {
      cy.findByText("Sign In").click();

      cy.fillSignInForm();

      const testTitles = ["c", "a", "1"].map((x) => `Resume ${x}`);
      for (const testTitle of testTitles) {
        cy.visit("http://localhost:3000/new-resume");
        cy.findByLabelText("Title").type(testTitle);
        cy.findByText("Resume").click();
        cy.findByText(testTitle);
      }

      cy.visit("http://localhost:3000");
      const frontPageResumes = cy.findAllByText(/Resume ./);
      frontPageResumes.should("have.length", 3);
      frontPageResumes.each((el, i) => {
        cy.wrap(el).should("have.text", testTitles[testTitles.length - 1 - i]);
      });
    });
  });

  describe("with only enough items for the front page", () => {
    beforeEach(() => {
      cy.resetData("front-page-only");
      cy.visit("http://localhost:3000");
    });

    it("should not display a link to the index", () => {
      const allTitles = [3, 2, 1].map((x) => `Resume ${x}`);

      // Homepage should have latest three resumes
      cy.checkTitlesInOrder(allTitles);

      cy.findAllByText("More").should("not.exist");
    });
  });

  describe("with two pages of items", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("http://localhost:3000");
    });

    it("should display the latest three resumes", () => {
      const allTitles = [6, 5, 4, 3, 2, 1].map((x) => `Resume ${x}`);

      // Homepage should have latest three resumes
      cy.checkTitlesInOrder(allTitles.slice(0, 3));

      // First page should have latest 5 resumes
      cy.findByText("More").click();
      cy.checkTitlesInOrder(allTitles.slice(0, 5));

      // Second page should have the last one resume
      cy.findByText("→").click();
      cy.checkTitlesInOrder(allTitles.slice(5));
    });
  });
});
