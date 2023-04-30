describe('Settins Page Test', () => {
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

        cy.visit('http://localhost:4200/home/settings');
    });

    describe('Header Test', () => {
        it('Contains Back Button', () => {
            cy.get('ion-header').get('ion-button').should('be.visible');
        });

        it('Navigates to Profile Page from Back Button', () => {
            cy.get('ion-header').get('ion-button').click();
            cy.url().should('include', '/profile');
        });
    });

    it('Contains Content', () => {
        cy.get('ion-content').should('be.visible');
    });

    // Privacy Setting
    describe('Privacy Setting Test', () => {
        it('Contains Privacy Tab', () => {
            cy.get('ion-label').contains('Privacy').should('be.visible');
        });

        it('Contains Privacy Explanation', () => {
            cy.get('ion-label').contains('Privacy').click();
            cy.get('span').contains('Display your profile to other users?').should('be.visible');
        });

        it('Contains Privacy Toggle', () => {
            cy.get('ion-toggle').should('be.visible');
        });
    });

    // Update Profile Setting
    describe('Update Profile Setting Test', () => {
        it('Contains Update Profile Tab', () => {
            cy.get('ion-label').contains('Update Profile').should('be.visible');
        });

        it('Contains Username Update', () => {
            cy.get('ion-label').contains('Update Profile').click();
            cy.get('ion-input').contains('Username').parent().find('ion-input').should('exist');
        });
    });

    // Update Profile Picture Setting
    describe('Update Profile Picture Test', () => {
        it('Contains Update Profile Picture Tab', () => {
            cy.get('ion-label').contains('Update Profile Picture').should('be.visible');
        });

        it('Contains Slot for Uploading Picture', () => {
            cy.get('ion[type="file"]').should('be.visible');
        });

        it('Contains Button to Submit', () => {
            cy.get('ion-button').contains('Update your profile picture').should('be.visible');
        })
    });
    
    // Update Password Setting
    describe('Update Password Setting Test', () => {
        it('Contains Update Password Tab', () => {
            cy.get('ion-label').contains('Update Password').should('be.visible');
        });

        it('Contains Update Password Button', () => {
            cy.get('ion-label').contains('Update Password').click();
            cy.get('ion-button').contains('Update your password').should('be.visible');
        });

        it('Navigates to Forgot page', () => {
            cy.get('ion-button').contains('Update your password').click();
            cy.url().should('include', '/forgot');
        });

        it('Navigates back to Settings Page', () => {
            cy.get('ion-back-button').click();
            cy.url().should('include', '/settings');
        });
    });

    // Terms of Service 
    describe('Terms of Service Test', () => {
        it('Contains TOS Tab', () => {
            cy.get('ion-label').contains('Terms of Service').should('be.visible');
        });

        it('Contains TOS Button', () => {
            cy.get('ion-label').contains('Terms of Service').click();
            cy.get('ion-button').contains('View our Terms of Service').should('be.visible');
        });

        it('Navigates to TOS Page', () => {
            cy.get('ion-button').contains('View our Terms of Service').click();
            cy.url().should('include', '/tos')
        });

        it('Navigates back to Settings Page', () => {
            cy.get('ion-back-button').should('be.visible');
            cy.get('ion-back-button').click();
            cy.url().should('include', '/settings');
        });
    });

    // Privacy Policy
    describe('Privacy Policy Test', () => {
        it('Contains Privacy Policy Tab', () => {
            cy.get('ion-label').contains('Privacy Policy').should('be.visible');
        });

        it('Contains Button for Privacy Policy', () => {
            cy.get('ion-label').contains('Privacy Policy').click();
            cy.get('ion-button').contains('View our Privacy Policy').should('be.visible');
        });

        it('Navigates to Privacy Policy Page', () => {
            cy.get('ion-button').contains('View our Privacy Policy').click();
            cy.url().should('include', '/privacy');
        });

        it('Navigates back to Settings Page', () => {
            cy.get('ion-back-button').click();
            cy.url().should('include', '/settings');
        });
    });

    // Version
    it('Contains Version Tab', () => {
        cy.get('ion-label').contains('Version').should('be.visible');
    });


    // Delete Account Settings
    describe('Delete Account Setting Test', () => {
        it('Contains Delete Account Tab', () => {
            cy.get('ion-label').contains('Delete Account').should('be.visible');
        });

        it('Contains warning before deleting account', () => {
            cy.get('ion-label').contains('Delete Account').click();
            cy.get('p').contains('Are you sure you want to delete your account?').should('be.visible');
            cy.get('ion-text').contains('You will loose all your data if you do so!').should('be.visible');
        });

        it('Button to Delete Account', () => {
            cy.get('ion-button').contains('Delete Account').should('be.visible');
        })

        it('Navigate to Register Page', () => {
            cy.get('ion-button').contains('Delete Account').click();
            cy.url().should('include', '/welcome');
        });
    });
});
