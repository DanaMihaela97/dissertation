/// <reference types="cypress" />

describe("Fluxul de adăugare recenzii", () => {
  let token: string;
  const baseUrl = "http://localhost:3000";

  it("permite unui utilizator să posteze o recenzie și să fie vizibilă în UI și API", () => {
    cy.visit("http://localhost:3000/login"); // Sau unde se află pagina ta de login

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
    // Interceptează cererile GET pentru recenzii
     cy.get('[data-cy="nav-reviews-link"]').click();

    // Verificăm că am ajuns pe pagina corectă
    cy.url().should('include', '/review');
    cy.get('h2').contains('Spune-ne părerea ta').should('be.visible');

    // Interceptăm cererea GET pentru a aștepta încărcarea recenziilor existente
    cy.intercept('GET', '**/api/reviews').as('getReviews');
    cy.wait('@getReviews');

    const feedbackText = `Cypress test - O recenzie excelentă! ${new Date().getTime()}`;

    // Pasul 4: Completează și trimite formularul
    cy.get('[data-cy="rating-stars"]').eq(4).click(); // Click pe a 5-a stea
    cy.get('[data-cy="feedback-textarea"]').type(feedbackText);
    cy.get('[data-cy="submit-review-button"]').click();

    // Pasul 5: Verifică dacă recenzia a apărut
    // După trimitere, aplicația face un nou request GET. Așteptăm ca acesta să se termine.
    cy.wait('@getReviews');

    // Căutăm în listă recenzia noastră după textul unic
    cy.get('[data-cy="review-list"]')
      .contains('[data-cy="review-card"]', feedbackText)
      .should('be.visible');

    cy.log('SUCCES: Recenzia a fost adăugată și este vizibilă în UI!');
  });
});