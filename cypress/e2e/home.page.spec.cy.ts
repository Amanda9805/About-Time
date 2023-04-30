// Page where you can view all available feed. Not one specific feed, therefore Feed-closed

describe('Feed-closed Page Test', () => {
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

        cy.visit('http://localhost:4200/home/feed')
    });
});