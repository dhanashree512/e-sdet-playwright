import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ApiWorld } from '../support/world';

Before(async function (this: ApiWorld) {
  await this.initApiContext();
});

After(async function (this: ApiWorld) {
  await this.disposeApiContext();
});

// ── Given steps ────────────────────────────────────────────────────────

Given('the API base URL is configured', function (this: ApiWorld) {
  expect(this.baseURL).toBeTruthy();
});

Given('I have a user payload with name {string} and email {string}',
  function (this: ApiWorld, name: string, email: string) {
    this.payload = { name, email, username: name.toLowerCase().replace(' ', '') };
  }
);

// ── When steps ─────────────────────────────────────────────────────────

When('I send a GET request to {string}',
  async function (this: ApiWorld, endpoint: string) {
    this.response = await this.apiContext.get(endpoint);
  }
);

When('I send a POST request to {string}',
  async function (this: ApiWorld, endpoint: string) {
    this.response = await this.apiContext.post(endpoint, {
      data: this.payload,
    });
  }
);

When('I send a PUT request to {string}',
  async function (this: ApiWorld, endpoint: string) {
    this.response = await this.apiContext.put(endpoint, {
      data: this.payload,
    });
  }
);

When('I send a DELETE request to {string}',
  async function (this: ApiWorld, endpoint: string) {
    this.response = await this.apiContext.delete(endpoint);
  }
);

// ── Then steps ─────────────────────────────────────────────────────────

Then('the response status should be {int}',
  async function (this: ApiWorld, statusCode: number) {
    expect(this.response.status()).toBe(statusCode);
  }
);

Then('the response should contain a list of users',
  async function (this: ApiWorld) {
    const body = await this.response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  }
);

Then('each user should have properties {string}, {string}, {string}',
  async function (this: ApiWorld, prop1: string, prop2: string, prop3: string) {
    const body = await this.response.json();
    const user = body[0];
    expect(user).toHaveProperty(prop1);
    expect(user).toHaveProperty(prop2);
    expect(user).toHaveProperty(prop3);
  }
);

Then('the response should have property {string} with value {string}',
  async function (this: ApiWorld, property: string, value: string) {
    const body = await this.response.json();
    expect(String(body[property])).toBe(value);
  }
);

Then('the response body should contain an {string} field',
  async function (this: ApiWorld, field: string) {
    const body = await this.response.json();
    expect(body).toHaveProperty(field);
  }
);