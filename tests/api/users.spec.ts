import { test, expect } from '@playwright/test';

// const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Users API', () => {

  test.describe('GET /users', () => {

    test('should return 200 and a list of users', async ({ request }) => {
      const response = await request.get(`/users`);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBeGreaterThan(0);
    });

    test('should return correct user object structure', async ({ request }) => {
      const response = await request.get(`/users`);
      const body = await response.json();
      const user = body[0];

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('address');
    });

    test('should return a single user by id', async ({ request }) => {
      const response = await request.get(`/users/2`);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('id', 2);
      expect(body).toHaveProperty('email');
      expect(body).toHaveProperty('name');
    });

    test('should return 404 for non-existent user', async ({ request }) => {
      const response = await request.get(`/users/9999`);
      expect(response.status()).toBe(404);
    });

  });

  test.describe('POST /users', () => {

    test('should create a new user and return 201', async ({ request }) => {
      const payload = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@ensora.com',
      };

      const response = await request.post(`/users`, {
        data: payload,
      });

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty('name', payload.name);
      expect(body).toHaveProperty('email', payload.email);
      expect(body).toHaveProperty('id');
    });

    test('should return id as a number when user is created', async ({ request }) => {
      const response = await request.post(`/users`, {
        data: { name: 'Jane', username: 'jane', email: 'jane@ensora.com' },
      });

      const body = await response.json();
      expect(typeof body.id).toBe('number');
    });

  });

  test.describe('PUT /users', () => {

    test('should update a user and return 200', async ({ request }) => {
      const payload = {
        name: 'John Updated',
        username: 'johnupdated',
        email: 'johnupdated@ensora.com',
      };

      const response = await request.put(`/users/2`, {
        data: payload,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('name', payload.name);
      expect(body).toHaveProperty('email', payload.email);
    });

  });

  test.describe('DELETE /users', () => {

    test('should delete a user and return 200', async ({ request }) => {
      const response = await request.delete(`/users/2`);
      expect(response.status()).toBe(200);
    });

  });

});