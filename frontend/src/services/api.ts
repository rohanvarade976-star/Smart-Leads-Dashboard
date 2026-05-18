import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, Lead, LeadFilters, CreateLeadForm, LoginForm, RegisterForm, User, PaginationMeta } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    this.client.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(data: LoginForm): Promise<{ token: string; user: User }> {
    const res: AxiosResponse<ApiResponse<{ token: string; user: User }>> =
      await this.client.post('/auth/login', data);
    return res.data.data!;
  }

  async register(data: RegisterForm): Promise<{ token: string; user: User }> {
    const res: AxiosResponse<ApiResponse<{ token: string; user: User }>> =
      await this.client.post('/auth/register', data);
    return res.data.data!;
  }

  async getMe(): Promise<User> {
    const res: AxiosResponse<ApiResponse<User>> = await this.client.get('/auth/me');
    return res.data.data!;
  }

  // Leads
  async getLeads(filters: LeadFilters): Promise<{ leads: Lead[]; meta: PaginationMeta }> {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
    );
    const res: AxiosResponse<ApiResponse<Lead[]>> = await this.client.get('/leads', { params });
    return { leads: res.data.data || [], meta: res.data.meta! };
  }

  async getLead(id: string): Promise<Lead> {
    const res: AxiosResponse<ApiResponse<Lead>> = await this.client.get(`/leads/${id}`);
    return res.data.data!;
  }

  async createLead(data: CreateLeadForm): Promise<Lead> {
    const res: AxiosResponse<ApiResponse<Lead>> = await this.client.post('/leads', data);
    return res.data.data!;
  }

  async updateLead(id: string, data: Partial<CreateLeadForm>): Promise<Lead> {
    const res: AxiosResponse<ApiResponse<Lead>> = await this.client.put(`/leads/${id}`, data);
    return res.data.data!;
  }

  async deleteLead(id: string): Promise<void> {
    await this.client.delete(`/leads/${id}`);
  }

  getExportUrl(filters: LeadFilters): string {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    params.set('token', token || '');
    return `${BASE_URL}/leads/export/csv?${params.toString()}`;
  }
}

export const api = new ApiService();
