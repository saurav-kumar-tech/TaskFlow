package com.taskmanager.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private Long userId;

    public AuthResponse(String token, String username, String email, Long userId) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public Long getUserId() { return userId; }
}