package com.taskmanager.websocket;

import com.taskmanager.security.JwtService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;

@Component
public class TaskWebSocketHandler extends TextWebSocketHandler {

    private final JwtService jwtService;
    private final NotificationService notificationService;

    public TaskWebSocketHandler(JwtService jwtService, NotificationService notificationService) {
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
        String token = extractToken(session);
        if (token == null) {
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Missing token"));
            return;
        }
        try {
            String username = jwtService.extractUsername(token);
            if (username == null) {
                session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Invalid token"));
                return;
            }
            session.getAttributes().put("username", username);
            notificationService.register(username, session);
        } catch (Exception e) {
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Invalid token"));
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        Object username = session.getAttributes().get("username");
        if (username != null) {
            notificationService.unregister(username.toString(), session);
        }
    }

    private String extractToken(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null || uri.getQuery() == null) return null;
        for (String param : uri.getQuery().split("&")) {
            int idx = param.indexOf('=');
            if (idx > 0) {
                String k = param.substring(0, idx);
                String v = param.substring(idx + 1);
                if ("token".equals(k)) return v;
            }
        }
        return null;
    }
}