describe('Login Page Test', () => {

  beforeEach(() => {
    cy.viewport(390, 844);
    cy.visit('http://localhost:4200/login');

    cy.location('pathname').then((current) => {
      if(current.includes('home/feed')) {
        cy.get('ion-tab-button').contains('Profile').click();
        cy.get('ion-button').contains('Logout').click();
      }
    });

  });

  it('Displays Content', () => {
    cy.get('ion-content').should('be.visible');
  });

  it('Contains Login Form', () => {
    cy.get('form').should('be.visible');
    cy.get('ion-button').contains("Welcome. You're late!").should('be.visible');
  });

  it('Contains Email Input field', () => {
    cy.get('ion-input[formControlName="email"]')
    .find('input')
    .should('have.attr', 'type', 'email');
  });

  it('Contains Password Input field', () => {
    cy.get('ion-input[formControlName="password"]')
    .find('input')
    .should('have.attr', 'type', 'password');
  });

  it('Contains Forgot Password Option', () => {
    cy.get('ion-text').contains('Forgot Password?').should('be.visible');
  });

  it('Navigates to Forgot Password Page', () => {
    cy.get('ion-text').contains('Forgot Password?').click();
    cy.url().should('include', '/forgot');
  });

  it('Contains Sign In With Google Option', () => {
    cy.get('ion-button').contains('Continue with Google').should('be.visible');
  });

  it('Contains Sign In With Facebook Option', () => {
    cy.get('ion-button').contains('Continue with Facebook').should('be.visible');
  });

  it('Contains Register Option', () => {
    cy.get('ion-text').contains('Register').should('be.visible');
  });

  it('Navigates to Register Page', () => {
    cy.get('ion-text').contains('Register').click();
    cy.url().should('include', '/register');
  });

  it('Logs user in', () => {
    cy.get('ion-input[formControlName="email"]')
    .find('input')
    .type('test@test.com');

    cy.get('ion-input[formControlName="password"]')
    .find('input')
    .type('Testing123?');

    cy.get('ion-button').contains("Welcome. You're late!").click();
    cy.location('pathname').then((current) => {
      if(!current.includes('home/feed')) {
        cy.get('ion-button').contains("Welcome. You're late!").click();
      }
    });
    cy.wait(2000);
    cy.url().should('include', '/home/feed');
  });
});
