// API Client for Backend Communication

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Customer endpoints
  async getCustomers(branchId: string, filters?: { station?: string; status?: string }) {
    const params = new URLSearchParams({ branchId, ...filters });
    return this.request(`/customers?${params}`);
  }

  async getCustomer(id: number) {
    return this.request(`/customers/${id}`);
  }

  async createCustomer(data: any) {
    return this.request(`/customers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: number, data: any) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async moveCustomer(id: number, direction: 'next' | 'previous') {
    return this.request(`/customers/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ direction }),
    });
  }

  async updateCustomerStatus(id: number, status: string) {
    return this.request(`/customers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async completeCustomer(id: number) {
    return this.request(`/customers/${id}/complete`, {
      method: 'PATCH',
    });
  }

  async deleteCustomer(id: number) {
    return this.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings endpoints
  async getSettings(branchId: string) {
    return this.request(`/settings/${branchId}`);
  }

  async updateSettings(branchId: string, data: any) {
    return this.request(`/settings/${branchId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Statistics endpoints
  async getStatistics(branchId: string) {
    return this.request(`/stats/${branchId}`);
  }

  async getCompletedCustomers(branchId: string, limit = 100) {
    return this.request(`/stats/${branchId}/completed?limit=${limit}`);
  }
}

export const apiClient = new APIClient(API_URL);
