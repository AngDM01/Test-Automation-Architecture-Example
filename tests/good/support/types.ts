export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}
