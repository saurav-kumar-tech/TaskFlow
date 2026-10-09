package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.model.Task;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> list(@AuthenticationPrincipal UserDetails user) {
        return taskService.findAll(user.getUsername());
    }

    @PostMapping
    public Task create(@AuthenticationPrincipal UserDetails user,
                       @RequestBody TaskRequest req) {
        return taskService.create(user.getUsername(), req);
    }

    @PutMapping("/{id}")
    public Task update(@AuthenticationPrincipal UserDetails user,
                       @PathVariable Long id,
                       @RequestBody TaskRequest req) {
        return taskService.update(user.getUsername(), id, req);
    }

    @PatchMapping("/{id}/status")
    public Task updateStatus(@AuthenticationPrincipal UserDetails user,
                             @PathVariable Long id,
                             @RequestParam("value") TaskStatus value) {
        return taskService.updateStatus(user.getUsername(), id, value);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails user,
                                       @PathVariable Long id) {
        taskService.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}