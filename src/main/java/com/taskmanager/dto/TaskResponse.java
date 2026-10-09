package com.taskmanager.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.taskmanager.model.Task;
import com.taskmanager.model.TaskPriority;
import com.taskmanager.model.TaskStatus;

public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private String category;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaskResponse() {}

    public static TaskResponse from(Task task) {
        TaskResponse r = new TaskResponse();
        r.id = task.getId();
        r.title = task.getTitle();
        r.description = task.getDescription();
        r.status = task.getStatus();
        r.priority = task.getPriority();
        r.dueDate = task.getDueDate();
        r.category = task.getCategory();
        r.tags = task.getTags();
        r.createdAt = task.getCreatedAt();
        r.updatedAt = task.getUpdatedAt();
        return r;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public TaskStatus getStatus() { return status; }
    public TaskPriority getPriority() { return priority; }
    public LocalDate getDueDate() { return dueDate; }
    public String getCategory() { return category; }
    public String getTags() { return tags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}