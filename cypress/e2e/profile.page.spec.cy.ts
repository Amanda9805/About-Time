describe('Profile Page Test', () => {
    beforeEach(() => {
        cy.viewport(390, 844);
        cy.visit('http://localhost:4200/login');
        cy.wait(2000);
    
        cy.location('pathname').then((current) => {
          if(!current.includes('home/feed')) {
            cy.get('ion-input[formControlName="email"]')
            .find('input')
            .type('test@test.com');
    
            cy.get('ion-input[formControlName="password"]')
            .find('input')
            .type('Testing123?');
            cy.wait(250);
    
            cy.get('ion-button').contains("It's about time!").click();
            cy.location('pathname').then((curr) => {
              if(!curr.includes('home/feed')) {
                cy.get('ion-button').contains("It's about time!").click();
              }
            });
          }
        });

        cy.visit('http://localhost:4200/home/profile');
    });

    describe('Profile Header Test', () => {
        it('Contains Header', () => {
            cy.get('ion-header').should('be.visible');
        });

        it('Contains User Profile Pic Section', () => {
            cy.get('ion-avatar').should('be.visible');
        });

        it('User Title Display Test', () => {
            cy.get('h5').should('be.visible'); // no name for title in ui
        });

        it('Contains User Time', () => {
            cy.get('h2').should('be.visible'); // no name for time left in ui
        });

        it('Navigates to Settings Page', () => {
          cy.get('ion-button').contains('Settings').click();
          cy.url().should('include', '/settings');
        });
    });

    it('Displays Content', () => {
      cy.get('ion-content').should('be.visible');
    });

    /*describe('User Posts Tests', () => {
         will work on this later 
    });*/

});

