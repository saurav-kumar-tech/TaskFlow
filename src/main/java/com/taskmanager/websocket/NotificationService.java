package com.taskmanager.websocket;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {

    private final Map<String, Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();

    public void register(String username, WebSocketSession session) {
        sessions.computeIfAbsent(username, k -> ConcurrentHashMap.newKeySet()).add(session);
    }

    public void unregister(String username, WebSocketSession session) {
        Set<WebSocketSession> set = sessions.get(username);
        if (set != null) {
            set.remove(session);
            if (set.isEmpty()) sessions.remove(username);
        }
    }

    public void broadcast(String username, String event, Long taskId) {
        Set<WebSocketSession> set = sessions.get(username);
        if (set == null || set.isEmpty()) return;

        String json = "{\"event\":\"" + event + "\",\"taskId\":" + taskId + "}";
        TextMessage message = new TextMessage(json);

        for (WebSocketSession session : set) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(message);
                } catch (IOException ignored) {
                }
            }
        }
    }
}