import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './services/todoService';
import type { Todo } from './types/Todo';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (todo: Omit<Todo, 'id'>) => {
    try {
      await createTodo(todo);
      fetchTodos();
    } catch {
      setError('Failed to add todo');
    }
  };

  const handleUpdate = async (todo: Todo) => {
    try {
      await updateTodo(todo);
      setEditingTodo(null);
      fetchTodos();
    } catch {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch {
      setError('Failed to delete todo');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Todo App</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <TodoForm onAdd={handleAdd} onUpdate={handleUpdate} editingTodo={editingTodo} setEditingTodo={setEditingTodo} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TodoList todos={todos} onEdit={setEditingTodo} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default App;
