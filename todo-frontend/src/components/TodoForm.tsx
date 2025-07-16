import React, { useEffect, useState } from 'react';
import type { Todo } from '../types/Todo';

interface TodoFormProps {
  onAdd: (todo: Omit<Todo, 'id'>) => void;
  onUpdate: (todo: Todo) => void;
  editingTodo: Todo | null;
  setEditingTodo: (todo: Todo | null) => void;
}

const initialForm = { title: '', description: '', completed: false };

const TodoForm: React.FC<TodoFormProps> = ({ onAdd, onUpdate, editingTodo, setEditingTodo }) => {
  const [form, setForm] = useState<Omit<Todo, 'id'>>(initialForm);

  useEffect(() => {
    if (editingTodo) {
      setForm({
        title: editingTodo.title,
        description: editingTodo.description,
        completed: editingTodo.completed,
      });
    } else {
      setForm(initialForm);
    }
  }, [editingTodo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTodo) {
      onUpdate({ ...editingTodo, ...form });
    } else {
      onAdd(form);
    }
    setEditingTodo(null);
    setForm(initialForm);
  };

  const handleCancel = () => {
    setEditingTodo(null);
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Enter todo title"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Enter description"
        />
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          name="completed"
          checked={form.completed}
          onChange={handleChange}
          id="completedCheck"
        />
        <label className="form-check-label" htmlFor="completedCheck">
          Completed
        </label>
      </div>
      <button type="submit" className="btn btn-success me-2">
        {editingTodo ? 'Update' : 'Add'} Todo
      </button>
      {editingTodo && (
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default TodoForm; 