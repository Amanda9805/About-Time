describe('Search Page Test', () => {
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

        cy.visit('http://localhost:4200/home/search');
    });

    it('Displays Content', () => {
        cy.get('ion-content').should('be.visible');
    });

    it('Contains Time', () => {
        cy.get('mp-timer').should('be.visible');
    });

    
    it('Contains Search Bar', () => {
        cy.get('ion-searchbar').should('be.visible');
    });

    /*describe('Search Results Tests', () => {
         will work on this later 
    });*/
});

