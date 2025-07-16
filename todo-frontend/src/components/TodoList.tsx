import React from 'react';
import type { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onEdit, onDelete }) => (
  <table className="table table-striped">
    <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Completed</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {todos.map(todo => (
        <tr key={todo.id}>
          <td>{todo.title}</td>
          <td>{todo.description}</td>
          <td>{todo.completed ? 'Yes' : 'No'}</td>
          <td>
            <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(todo)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(todo.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TodoList; 