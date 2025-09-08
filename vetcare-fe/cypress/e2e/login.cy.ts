
describe("Fluxul de autentificare in aplicatie", () => {

  it("permite unui utilizator să se autentifice si să fie numele vizibil în UI", () => {
    cy.get('[data-cy="nav-login-link"]').click();

    cy.get('[data-cy="keycloak-login-button"]').click();

    cy.origin("http://localhost:8080", () => {
      cy.get("input#username")
      .should("be.visible")
      .type("danamaritca@gmail.com");
      cy.get("input#password").should("be.visible").type("dana");
      cy.get("button#kc-login").click();
    });

    cy.url().should("include", "/home");

    cy.get('[data-cy="nav-user-name"]').contains('Dana Maritca').should('be.visible');
    cy.get('[data-cy="nav-logout-link"]').should('be.visible');

    cy.get('[data-cy="nav-login-link"]').should('not.exist');
    cy.get('[data-cy="nav-register-link"]').should('not.exist');

    cy.log('SUCCES: utilizatorul a fost autentificat!');
  });
});