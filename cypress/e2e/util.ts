export function checkTitlesInOrder(titles: string[]) {
  const items = cy.findAllByRole("listitem");
  items.should("have.length", titles.length);
  items.each((el, i) => cy.wrap(el).findByText(titles[i]));
}

export function fillLoginForm() {
  cy.findByLabelText("Email").type("admin@nextmail.com");
  cy.findByLabelText("Password").type("password");
  cy.findByText("Log in").click();
}
