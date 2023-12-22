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
      const testCompany = "Test Company";
      const testJob = "Test Job";

      // We should start with no resumes
      cy.findByText("There are no resumes yet.");
      cy.findAllByText(testCompany).should("not.exist");

      cy.findByText("New Resume").click();

      cy.fillSignInForm();

      cy.findByLabelText("Company").type(testCompany);
      cy.findByLabelText("Job").type(testJob);
      cy.findByText("Submit").click();
      cy.findByText(testCompany);

      // Check home and ensure the resume is present
      cy.visit("http://localhost:3000");
      cy.findByText(testCompany).click();

      // Delete the resume and ensure it's gone
      cy.findByText("Delete").click();
      cy.findAllByText(testCompany).should("not.exist");

      cy.request({
        url: "http://localhost:3000/resume/test-company",
        failOnStatusCode: false,
      })
        .its("status")
        .should("equal", 404);
    });

    it("should be able to create resumes and see them in chronological order", () => {
      cy.findByText("Sign In").click();
      const testJob = "Test Job";

      cy.fillSignInForm();

      const testCompanies = ["c", "a", "1"].map((x) => `Resume ${x}`);
      for (const testCompany of testCompanies) {
        cy.visit("http://localhost:3000/new-resume");
        cy.findByLabelText("Company").type(testCompany);
        cy.findByLabelText("Job").type(testJob);
        cy.findByText("Submit").click();
        cy.findByText(testCompany);
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
      const allCompanies = [3, 2, 1].map((x) => `Resume ${x}`);

      // Homepage should have latest three resumes
      cy.checkCompaniesInOrder(allCompanies);

      cy.findAllByText("More").should("not.exist");
    });
  });

  describe("with two pages of items", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("http://localhost:3000");
    });

    it("should display the latest three resumes", () => {
      const allCompanies = [6, 5, 4, 3, 2, 1].map((x) => `Resume ${x}`);

      // Homepage should have latest three resumes
      cy.checkCompaniesInOrder(allCompanies.slice(0, 3));

      // First page should have latest 5 resumes
      cy.findByText("More").click();
      cy.checkCompaniesInOrder(allCompanies.slice(0, 5));

      // Second page should have the last one resume
      cy.findByText("→").click();
      cy.checkCompaniesInOrder(allCompanies.slice(5));
    });
  });
});
