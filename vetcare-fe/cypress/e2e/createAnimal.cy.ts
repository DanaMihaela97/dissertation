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

      // Deschidem dropdown-ul din navbar
      cy.contains("Animăluțul tău").click();

// Selectăm link-ul pentru creare profil
      cy.contains("Creează profil pentru animăluțul tău").click();

// Verificăm că am ajuns pe pagina de creare profil
      cy.url().should("include", "/create-animal-profile");

// --- Step 1 - informații despre animal ---
      cy.get('[data-cy="animal-name"]').type("Bella");
      cy.get('[data-cy="animal-birthdate"]').type("2019-05-10");
      cy.get('[data-cy="animal-sex"]').select("Femelă");
      cy.get('[data-cy="animal-weight"]').type("10");
      cy.get('[data-cy="animal-type"]').select("Câine");
      cy.get('[data-cy="animal-breed"]', { timeout: 10000 })
      .should('not.be.disabled');

// 3. Re-obținem elementul după ce s-a re-renderizat și selectăm rasa
      cy.get('[data-cy="animal-breed"]').select('Akita');

// 3. Selectăm rasa dorită
      cy.get('[data-cy="animal-breed"]').select('Akita');
      cy.contains("Continuă către vaccinuri").click();

// --- Step 2 - vaccinuri (opțional) ---
      cy.get('input[type="checkbox"]').first().check();
      cy.get('input[type="date"]').first().type("2023-01-15");

// Trimitem formularul
      cy.contains("Trimite").click();

// Verificăm că profilul a fost creat
      cy.url().should("include", "/animals");

      // Așteptăm să apară fereastra Swal
      cy.get('.swal2-popup', { timeout: 10000 }).should('be.visible')
      .within(() => {
         cy.get('button.swal2-confirm').click();
      });

// Verificăm că am ajuns pe lista de animale
      cy.url().should('include', '/animals');



   });

});

