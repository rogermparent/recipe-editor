/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('signIn', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       signIn(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import "@testing-library/cypress/add-commands";

interface SignInOptions {
  email: string;
  password: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      resetData(fixture?: string): Chainable<void>;
      fillSignInForm(user?: SignInOptions): Chainable<void>;
      signIn(user?: SignInOptions): Chainable<void>;
      checkCompaniesInOrder(companies: string[]): Chainable<void>;
    }
  }
}

Cypress.Commands.add("resetData", (fixture) => {
  cy.task("resetData", fixture);
  fetch("http://localhost:3000/settings/invalidate-cache");
});

Cypress.Commands.add("checkCompaniesInOrder", (companies: string[]) => {
  const items = cy.findAllByRole("listitem");
  items.should("have.length", companies.length);
  items.each((el, i) => cy.wrap(el).findByText(companies[i]));
});

Cypress.Commands.add(
  "fillSignInForm",
  ({ email = "admin@nextmail.com", password = "password" } = {}) => {
    cy.findByLabelText("Email").type(email);
    cy.findByLabelText("Password").type(password);
    cy.findByText("Sign in with Credentials").click();
  },
);

Cypress.Commands.add("signIn", (options) => {
  cy.findByText("Sign In").click();
  cy.fillSignInForm(options);
});
