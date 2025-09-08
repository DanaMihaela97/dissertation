
describe("Fluxul de autentificare in aplicatie", () => {

   it("permite unui utilizator să se autentifice si să fie numele vizibil în UI", () => {
      cy.visit("http://localhost:3000/");
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

      cy.contains("Animale de companie").click();

      cy.contains("Adaugă un animal").click();

      cy.url().should("include", "/create-animal");

      cy.get('[data-cy="animal-name"]').type("Bella");
      cy.get('[data-cy="animal-birthdate"]').type("2019-05-10");
      cy.get('[data-cy="animal-sex"]').select("Femelă");
      cy.get('[data-cy="animal-weight"]').type("10");
      cy.get('[data-cy="animal-type"]').select("Câine");
      cy.get('[data-cy="animal-breed"]', { timeout: 10000 })
      .should('not.be.disabled');

      cy.get('[data-cy="animal-breed"]').select('Akita');

      cy.get('[data-cy="animal-breed"]').select('Akita');
      cy.contains("Continuă către vaccinuri").click();

      cy.get('input[type="checkbox"]').first().check();
      cy.get('input[type="date"]').first().type("2023-01-15");

      cy.contains("Trimite").click();

      cy.url().should("include", "/animals");

      cy.get('.swal2-popup', { timeout: 10000 }).should('be.visible')
      .within(() => {
         cy.get('button.swal2-confirm').click();
      });

      cy.url().should('include', '/animals');

   });

});
