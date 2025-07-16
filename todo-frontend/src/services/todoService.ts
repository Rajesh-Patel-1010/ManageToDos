import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Todo } from '../types/Todo';

const API_URL = '/api/todos';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get<Todo[]>(API_URL);
  return response.data;
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await axios.post<Todo>(API_URL, todo);
  return response.data;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await axios.put<Todo>(`${API_URL}/${todo.id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
}; 