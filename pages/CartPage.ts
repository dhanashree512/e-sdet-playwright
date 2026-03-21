import { Page, Locator } from '@playwright/test';

// Defines a class called CartPage and exports it so other files like 
// fixtures and tests can import and use it. 
// This is the Page Object Model pattern — one class per page.

export class CartPage {

  // These are class properties — they're declaring what data this class will hold. 
  // Two things to notice:readonly — means these properties can only be assigned 
  // once, inside the constructor. After that they can never be reassigned

  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly confirmationHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationHeader = page.locator('.complete-header');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  // Each page object encapsulates all the locators and actions for that page.
  // Locators are defined once in the constructor as readonly properties — 
  // so they can never be accidentally reassigned and any selector change 
  // is a single line fix. Methods are action-focused and accept parameters 
  // so tests stay clean and the page object stays flexible.

  async fillShippingInfo(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(zip);
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async getConfirmationMessage(): Promise<string> {
    return await this.confirmationHeader.innerText();
  }
}