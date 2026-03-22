import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { request, APIRequestContext } from '@playwright/test';

export class ApiWorld extends World {
  apiContext!: APIRequestContext;
  response!: any;
  payload: Record<string, any> = {};
  baseURL = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initApiContext() {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async disposeApiContext() {
    await this.apiContext.dispose();
  }
}

setWorldConstructor(ApiWorld);