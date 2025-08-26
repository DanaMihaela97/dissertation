/// <reference types="cypress" />

describe("Fluxul de autentificare in aplicatie", () => {

  it("permite unui utilizator să se autentifice si să fie numele vizibil în UI", () => {
    cy.visit("http://localhost:3000/"); // Sau unde se află pagina ta de login
    cy.get('[data-cy="nav-login-link"]').click();

    // 2. Dăm click pe butonul de autentificare
    // Adaugă `data-cy="keycloak-login-button"` pe butonul tău pentru un selector robust
    cy.get('[data-cy="keycloak-login-button"]').click();

    // 3. Cypress va fi redirecționat către Keycloak.
    // Folosim cy.origin() pentru a executa comenzi pe pagina Keycloak.
    cy.origin("http://localhost:8080", () => {
      // Așteptăm ca elementele de pe pagina Keycloak să fie vizibile
      cy.get("input#username")
      .should("be.visible")
      .type("maritcadana@gmail.com");
      cy.get("input#password").should("be.visible").type("dana");
      cy.get("button#kc-login").click();
    });

    // 4. După login, Keycloak ne redirecționează înapoi la aplicația noastră.
    // Verificăm dacă am ajuns la URL-ul corect (callbackUrl: "/home").
    cy.url().should("include", "/home");

    // Verificam daca suntem logati si apare numele nostru
    cy.get('[data-cy="nav-user-name"]').contains('Dana Maritca').should('be.visible');
    cy.get('[data-cy="nav-logout-link"]').should('be.visible');

    cy.get('[data-cy="nav-login-link"]').should('not.exist');
    cy.get('[data-cy="nav-register-link"]').should('not.exist');

    cy.log('SUCCES: utilizatorul a fost autentificat!');
  });
});