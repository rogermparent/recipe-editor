describe("Single DocPage View", () => {
  describe("with the two docPages fixture", () => {
    beforeEach(() => {
      cy.resetData("two-pages");
      cy.visit("http://localhost:3000/docPage/docPage-5");
    });

    it("should display a docPage", () => {
      cy.findByText("Page 5");
    });

    it("should not need authorization", () => {
      cy.findByText("Sign In");
    });

    it("should be able to edit a docPage", () => {
      cy.findByText("Edit").click();

      cy.fillSignInForm();

      cy.findByText("Editing Page: Page 5");

      cy.findByText("Advanced").click();

      const editedPage = "Edited Page";

      cy.findAllByLabelText("Name").first().clear().type(editedPage);

      const docPageDate = "2023-12-08T01:16:04.1";
      cy.findByLabelText("Date (UTC)").should("have.value", docPageDate);

      cy.findByText("Submit").click();

      cy.findByText(editedPage);

      cy.visit("http://localhost:3000/");
      cy.findByText(editedPage);
      cy.checkCompaniesInOrder(["Page 6", editedPage, "Page 4"]);

      // DocPage date should not have changed
      cy.findByText(new Date(docPageDate + "Z").toLocaleString());
    });

    it("should be able to delete the docPage", () => {
      cy.findByText("Delete").click();

      // First click of the delete button should trigger a sign-in
      cy.fillSignInForm();

      cy.findByText("Delete").click();

      cy.findByText("Page 3");
      cy.checkCompaniesInOrder(["Page 6", "Page 4", "Page 3"]);
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
