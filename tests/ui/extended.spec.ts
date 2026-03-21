import { test, expect } from '../../fixtures/extendedFixture';
import { PRODUCTS } from '../../utils/testData';

test.describe('Extended Fixtures Demo', () => {

  test('should start already logged in via storage state', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/inventory.html');
    await expect(authenticatedPage).toHaveURL(/inventory/);
  });

  test('should add item to cart using authenticated page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/inventory.html');
    const item = authenticatedPage.locator('.inventory_item').filter({ hasText: PRODUCTS.backpack });
    await item.locator('button').click();
    const badge = authenticatedPage.locator('.shopping_cart_badge');
    await expect(badge).toHaveText('1');
  });

  test('should fetch users using api client fixture', async ({ apiClient }) => {
    const response = await apiClient.get('/users');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('should create user using api client fixture', async ({ apiClient }) => {
    const response = await apiClient.post('/users', {
      data: { name: 'SDET Engineer', username: 'sdet', email: 'sdet@ensora.com' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
  });

  test('should generate unique test user via test data fixture', async ({ testUser }) => {
    expect(testUser.username).toContain('test_user_');
    expect(testUser.password).toBe('secret_sauce');
    console.log(`Running test with user: ${testUser.username}`);
  });

});