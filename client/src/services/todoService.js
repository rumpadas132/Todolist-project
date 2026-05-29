import { api } from './api';

export async function fetchTodos(params) {
  const { data } = await api.get('/todos', { params });
  return data.data.todos;
}

export async function fetchStats() {
  const { data } = await api.get('/todos/stats');
  return data.data.stats;
}

export async function createTodo(payload) {
  const { data } = await api.post('/todos', payload);
  return data.data.todo;
}

export async function updateTodo(id, payload) {
  const { data } = await api.patch(`/todos/${id}`, payload);
  return data.data.todo;
}

export async function deleteTodo(id) {
  await api.delete(`/todos/${id}`);
}
