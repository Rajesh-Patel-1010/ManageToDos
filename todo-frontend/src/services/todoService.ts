import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Todo } from '../types/Todo';

const API_URL = '/api/todos';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: '/api',
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTodos = async (): Promise<Todo[]> => {
  const response = await apiClient.get<Todo[]>('/todos');
  return response.data;
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await apiClient.post<Todo>('/todos', todo);
  return response.data;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await apiClient.put<Todo>(`/todos/${todo.id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await apiClient.delete(`/todos/${id}`);
}; 