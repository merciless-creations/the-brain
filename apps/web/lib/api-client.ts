const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface APIResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      pages: number
    }
    request_id?: string
    timestamp?: string
  }
}

export interface APIError {
  error: {
    code: string
    message: string
    details?: Array<{
      field: string
      message: string
    }>
  }
  meta?: {
    request_id?: string
    timestamp?: string
  }
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error: APIError = await response.json()
      throw new Error(error.error.message || 'API request failed')
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new APIClient(API_URL)
