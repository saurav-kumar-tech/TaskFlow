package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.model.Task;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.model.User;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.websocket.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TaskService(TaskRepository taskRepository,
                       UserRepository userRepository,
                       NotificationService notificationService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<Task> findAll(String username) {
        User user = getUser(username);
        return taskRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional(readOnly = true)
    public Task findById(String username, Long id) {
        User user = getUser(username);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (!task.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized to access this task");
        }
        return task;
    }

    @Transactional
    public Task create(String username, TaskRequest req) {
        User user = getUser(username);

        if (req.getTitle() == null || req.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }

        Task task = new Task();
        task.setTitle(req.getTitle().trim());
        task.setDescription(req.getDescription());
        if (req.getStatus() != null) task.setStatus(req.getStatus());
        if (req.getPriority() != null) task.setPriority(req.getPriority());
        task.setDueDate(req.getDueDate());
        task.setCategory(req.getCategory());
        task.setTags(req.getTags());
        task.setUser(user);

        Task saved = taskRepository.save(task);
        notificationService.broadcast(username, "CREATED", saved.getId());
        return saved;
    }

    @Transactional
    public Task update(String username, Long id, TaskRequest req) {
        Task task = findById(username, id);

        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            task.setTitle(req.getTitle().trim());
        }
        if (req.getDescription() != null) task.setDescription(req.getDescription());
        if (req.getStatus() != null) task.setStatus(req.getStatus());
        if (req.getPriority() != null) task.setPriority(req.getPriority());
        if (req.getDueDate() != null) task.setDueDate(req.getDueDate());
        if (req.getCategory() != null) task.setCategory(req.getCategory());
        if (req.getTags() != null) task.setTags(req.getTags());

        Task saved = taskRepository.save(task);
        notificationService.broadcast(username, "UPDATED", saved.getId());
        return saved;
    }

    @Transactional
    public Task updateStatus(String username, Long id, TaskStatus status) {
        if (status == null) throw new IllegalArgumentException("Status required");
        Task task = findById(username, id);
        task.setStatus(status);
        Task saved = taskRepository.save(task);
        notificationService.broadcast(username, "STATUS_CHANGED", saved.getId());
        return saved;
    }

    @Transactional
    public void delete(String username, Long id) {
        Task task = findById(username, id);
        taskRepository.delete(task);
        notificationService.broadcast(username, "DELETED", id);
    }
}