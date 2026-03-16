import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
  }

  async addItemToCartByName(itemName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: itemName });
    await item.locator('button').click();
  }

  async getCartCount(): Promise<string> {
    return await this.cartBadge.innerText();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async getInventoryItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }
}