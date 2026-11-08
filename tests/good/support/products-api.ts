import type { APIRequestContext, APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';
import type { CreateProductInput, Product } from './types';

export class ProductsApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
  ) {}

  private url(path = ''): string {
    return `${this.baseUrl}/api/products${path}`;
  }

  async list(): Promise<Product[]> {
    const response = await this.request.get(this.url());
    expect(response.status(), 'GET /api/products debe responder 200').toBe(200);
    return (await response.json()) as Product[];
  }

  async get(id: string): Promise<APIResponse> {
    return this.request.get(this.url(`/${encodeURIComponent(id)}`));
  }

  async create(input: CreateProductInput): Promise<APIResponse> {
    return this.request.post(this.url(), { data: input });
  }

  async createValid(input: CreateProductInput): Promise<Product> {
    const response = await this.create(input);
    expect(
      response.status(),
      `POST /api/products debe responder 201 para "${input.name}"`,
    ).toBe(201);
    return (await response.json()) as Product;
  }
}
