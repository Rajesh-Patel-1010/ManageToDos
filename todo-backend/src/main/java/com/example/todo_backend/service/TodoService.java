package com.example.todo_backend.service;

import com.example.todo_backend.dto.TodoRequest;
import com.example.todo_backend.dto.TodoResponse;
import com.example.todo_backend.model.Todo;
import com.example.todo_backend.repository.TodoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TodoService {
    private final TodoRepository todoRepository;
    private static final Logger logger = LoggerFactory.getLogger(TodoService.class);

    @Autowired
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @PreAuthorize("isAuthenticated()")
    public List<TodoResponse> getAllTodos() {
        logger.info("Fetching all todos");
        return todoRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @PreAuthorize("isAuthenticated()")
    public TodoResponse getTodoById(Long id) {
        logger.info("Fetching todo with id: {}", id);
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
        return toResponse(todo);
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public TodoResponse createTodo(TodoRequest request) {
        logger.info("Creating new todo: {}", request.getTitle());
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.isCompleted());
        Todo saved = todoRepository.save(todo);
        logger.info("Created todo with id: {}", saved.getId());
        return toResponse(saved);
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public TodoResponse updateTodo(Long id, TodoRequest request) {
        logger.info("Updating todo with id: {}", id);
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.isCompleted());
        Todo updated = todoRepository.save(todo);
        logger.info("Updated todo with id: {}", updated.getId());
        return toResponse(updated);
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    public void deleteTodo(Long id) {
        logger.info("Deleting todo with id: {}", id);
        if (!todoRepository.existsById(id)) {
            logger.warn("Todo with id {} not found for deletion", id);
            throw new RuntimeException("Todo not found");
        }
        todoRepository.deleteById(id);
        logger.info("Deleted todo with id: {}", id);
    }

    private TodoResponse toResponse(Todo todo) {
        TodoResponse response = new TodoResponse();
        response.setId(todo.getId());
        response.setTitle(todo.getTitle());
        response.setDescription(todo.getDescription());
        response.setCompleted(todo.isCompleted());
        response.setCreatedAt(todo.getCreatedAt());
        response.setUpdatedAt(todo.getUpdatedAt());
        return response;
    }
} 