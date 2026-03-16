import { test, expect } from '../../fixtures/baseFixture';
import { USERS, PRODUCTS, SHIPPING, MESSAGES } from '../../utils/testData';

test.describe('Checkout Flow', () => {

  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('should display inventory items after login', async ({ inventoryPage }) => {
    const count = await inventoryPage.getInventoryItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should add a single item to cart', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe('1');
  });

  test('should add multiple items to cart', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack);
    await inventoryPage.addItemToCartByName(PRODUCTS.bikeLight);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe('2');
  });

  test('should complete full checkout flow', async ({ inventoryPage, cartPage }) => {
    // Add items
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack);
    await inventoryPage.addItemToCartByName(PRODUCTS.bikeLight);

    // Go to cart
    await inventoryPage.goToCart();
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(2);

    // Checkout
    await cartPage.checkout();
    await cartPage.fillShippingInfo(
      SHIPPING.valid.firstName,
      SHIPPING.valid.lastName,
      SHIPPING.valid.zip
    );

    // Finish
    await cartPage.finishCheckout();
    const message = await cartPage.getConfirmationMessage();
    expect(message).toBe(MESSAGES.confirmation);
  });

  test('should navigate to cart and continue shopping', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory/);
  });

});