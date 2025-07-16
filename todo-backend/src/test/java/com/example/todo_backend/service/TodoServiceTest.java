package com.example.todo_backend.service;

import com.example.todo_backend.dto.TodoRequest;
import com.example.todo_backend.model.Todo;
import com.example.todo_backend.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TodoServiceTest {
    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoService todoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllTodos() {
        Todo todo = new Todo();
        todo.setTitle("Test");
        when(todoRepository.findAll()).thenReturn(Arrays.asList(todo));
        assertEquals(1, todoService.getAllTodos().size());
    }

    @Test
    void testCreateTodo() {
        TodoRequest request = new TodoRequest();
        request.setTitle("Test");
        Todo todo = new Todo();
        todo.setTitle("Test");
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);
        assertEquals("Test", todoService.createTodo(request).getTitle());
    }

    @Test
    void testGetTodoById_NotFound() {
        when(todoRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> todoService.getTodoById(1L));
    }

    @Test
    void testDeleteTodo_NotFound() {
        when(todoRepository.existsById(1L)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> todoService.deleteTodo(1L));
    }
} 