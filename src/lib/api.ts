const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: { phone: string; name?: string; password: string }) =>
      request<{ access_token: string; user: any }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: { phone: string; password: string }) =>
      request<{ access_token: string; user: any }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: (token: string) =>
      request<any>("/api/auth/me", { token }),
  },

  products: {
    list: (params?: { category?: string; search?: string; skip?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set("category", params.category);
      if (params?.search) searchParams.set("search", params.search);
      if (params?.skip) searchParams.set("skip", String(params.skip));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      const query = searchParams.toString();
      return request<any[]>(`/api/products${query ? `?${query}` : ""}`);
    },
    get: (id: string) =>
      request<any>(`/api/products/${id}`),
    categories: () =>
      request<any[]>("/api/products/categories"),
  },

  orders: {
    list: (token: string, params?: { skip?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.skip) searchParams.set("skip", String(params.skip));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      const query = searchParams.toString();
      return request<any[]>(`/api/orders${query ? `?${query}` : ""}`, { token });
    },
    get: (token: string, id: string) =>
      request<any>(`/api/orders/${id}`, { token }),
    create: (token: string, data: any) =>
      request<any>("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }),
    updateStatus: (token: string, id: string, status: string) =>
      request<any>(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        token,
      }),
  },

  addresses: {
    list: (token: string) =>
      request<any[]>("/api/addresses", { token }),
    create: (token: string, data: any) =>
      request<any>("/api/addresses", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }),
    update: (token: string, id: string, data: any) =>
      request<any>(`/api/addresses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      }),
    delete: (token: string, id: string) =>
      request<{ message: string }>(`/api/addresses/${id}`, {
        method: "DELETE",
        token,
      }),
  },

  rider: {
    profile: (token: string) =>
      request<any>("/api/riders/me", { token }),
    createProfile: (token: string, data: { name: string; phone: string }) =>
      request<any>("/api/riders", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }),
    toggleOnline: (token: string, isOnline: boolean) =>
      request<any>("/api/riders/me/status", {
        method: "PATCH",
        body: JSON.stringify({ is_online: isOnline }),
        token,
      }),
    updateLocation: (token: string, data: { latitude: number; longitude: number }) =>
      request<any>("/api/riders/me/location", {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      }),
    getAvailableOrders: (token: string) =>
      request<any[]>("/api/riders/orders/available", { token }),
    getMyOrders: (token: string) =>
      request<any[]>("/api/riders/orders/my", { token }),
    acceptOrder: (token: string, orderId: string) =>
      request<any>(`/api/riders/orders/${orderId}/accept`, {
        method: "POST",
        token,
      }),
    updateOrderStatus: (token: string, orderId: string, status: string) =>
      request<any>(`/api/riders/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        token,
      }),
  },

  seller: {
    orders: (token: string) =>
      request<any[]>("/api/orders/seller/me", { token }),
    products: (token: string) =>
      request<any[]>("/api/products/seller/me", { token }),
    createProduct: (token: string, data: any) =>
      request<any>("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }),
  },
};

export type Api = typeof api;