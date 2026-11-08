import type {
  ApiErrorBody,
  CreateProductInput,
  Product,
} from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    let body: ApiErrorBody | undefined;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = undefined;
    }

    throw new ApiError(
      body?.error.message ?? `La solicitud falló con estado ${response.status}.`,
      response.status,
      body?.error.fields ?? {},
    );
  }

  return (await response.json()) as T;
}

export const productsApi = {
  list(): Promise<Product[]> {
    return request<Product[]>('/api/products');
  },

  get(id: string): Promise<Product> {
    return request<Product>(`/api/products/${encodeURIComponent(id)}`);
  },

  create(input: CreateProductInput): Promise<Product> {
    return request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};
