

describe("Fluxul de adăugare recenzii", () => {
  const baseUrl = "http://ip-172-31-27-81.eu-north-1.compute.internal:3000";
  const keycloakUrl = "http://ec2-13-61-108-126.eu-north-1.compute.amazonaws.com:8080"

  it("permite unui utilizator să posteze o recenzie și să fie vizibilă în UI și API", () => {
    cy.visit(`${baseUrl}/login`);

    cy.get('[data-cy="keycloak-login-button"]').click();

    cy.origin(keycloakUrl, () => {
      cy.get("input#username")
      .should("be.visible")
      .type("danamaritca@gmail.com");
      cy.get("input#password").should("be.visible").type("dana");
      cy.get("button#kc-login").click();
    });

    cy.url().should("include", "/home");
    cy.get('[data-cy="nav-reviews-link"]').click();

    cy.url().should('include', '/review');
    cy.get('h2').contains('Spune-ne părerea ta').should('be.visible');

    cy.intercept('GET', '**/api/reviews').as('getReviews');
    cy.wait('@getReviews');

    const feedbackText = `Cypress test - O recenzie excelentă! ${new Date().getTime()}`;

    cy.get('[data-cy="rating-stars"]').eq(4).click();
    cy.get('[data-cy="feedback-textarea"]').type(feedbackText);
    cy.get('[data-cy="submit-review-button"]').click();

    cy.wait('@getReviews');

    cy.get('[data-cy="review-list"]')
    .contains('[data-cy="review-card"]', feedbackText)
    .should('be.visible');

    cy.log('SUCCES: Recenzia a fost adăugată și este vizibilă în UI!');
  });
});