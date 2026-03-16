import { test, expect } from '../../fixtures/baseFixture';
import { USERS, MESSAGES } from '../../utils/testData';

test.describe('Login Functionality', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(MESSAGES.lockedError);
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('should show error when username is empty', async ({ loginPage }) => {
    await loginPage.login('', USERS.standard.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('should show error when password is empty', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, '');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Password is required');
  });

});