describe("Single DocPage View", () => {
  describe("with the two docPages fixture", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("http://localhost:3000/docPage/docPage-5");
    });

    it("should display a docPage", () => {
      cy.findByText("Company 5");
    });

    it("should not need authorization", () => {
      cy.findByText("Sign In");
    });

    it("should be able to edit a docPage", () => {
      cy.findByText("Edit").click();

      cy.fillSignInForm();

      cy.findByText("Editing docPage: Company 5");

      cy.findByText("Advanced").click();

      const editedCompany = "Edited Company";

      cy.findAllByLabelText("Company").first().clear().type(editedCompany);

      const docPageDate = "2023-12-08T01:16:04.1";
      cy.findByLabelText("Date (UTC)").should("have.value", docPageDate);

      cy.findByText("Submit").click();

      cy.findByText(editedCompany);

      cy.visit("http://localhost:3000/");
      cy.findByText(editedCompany);
      cy.checkCompaniesInOrder(["Company 6", editedCompany, "Company 4"]);

      // DocPage date should not have changed
      cy.findByText(new Date(docPageDate + "Z").toLocaleString());
    });

    it("should be able to delete the docPage", () => {
      cy.findByText("Delete").click();

      // First click of the delete button should trigger a sign-in
      cy.fillSignInForm();

      cy.findByText("Delete").click();

      cy.findByText("Company 3");
      cy.checkCompaniesInOrder(["Company 6", "Company 4", "Company 3"]);
      cy.request({
        url: "http://localhost:3000/docPage/docPage-5",
        failOnStatusCode: false,
      })
        .its("status")
        .should("equal", 404);
    });
  });

  it("should have status 404 when docPage doesn't exist", () => {
    cy.request({
      url: "http://localhost:3000/docPage/non-existent-docPage",
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 404);
  });
});
