import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './services/todoService';
import type { Todo } from './types/Todo';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Login from './components/Login'; // Added import for Login component
import axios from "axios";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  // Add authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState("");

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

  // Handler for login
  const handleLogin = async (user: string, pass: string, email?: string) => {
    try {
      const endpoint = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegisterMode ? { username: user, password: pass, email } : { username: user, password: pass };
      const response = await axios.post(endpoint, payload);
      const token = response.data.token;
      localStorage.setItem("jwt", token);
      setIsAuthenticated(true);
      setAuthError("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setAuthError(err.response?.data || "Authentication failed");
      } else {
        setAuthError("Authentication failed");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
    setIsRegisterMode(false);
    setAuthError("");
  };

  const handleSwitchMode = () => {
    setIsRegisterMode((prev) => !prev);
    setAuthError("");
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h2>{isRegisterMode ? "Register" : "Login"}</h2>
        <Login onLogin={handleLogin} onSwitchMode={handleSwitchMode} isRegisterMode={isRegisterMode} />
        {authError && <div style={{ color: "red" }}>{authError}</div>}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <button onClick={handleLogout} style={{ float: "right", margin: 8 }}>Logout</button>
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
