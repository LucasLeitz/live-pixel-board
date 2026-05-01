package com.lucas.live_pixel_board.websocket;

import com.lucas.live_pixel_board.dto.PixelMessage;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class PixelWebSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private static final String HEX_COLOR_PATTERN = "^#[0-9A-Fa-f]{6}$";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("User connected: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("User disconnected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();

        PixelMessage pixelMessage;

        try {
            pixelMessage = objectMapper.readValue(payload, PixelMessage.class);
        } catch (Exception e) {
            System.out.println("Invalid JSON received: " + payload);
            return;
        }

        if (!isValidPixelMessage(pixelMessage)) {
            System.out.println("Invalid pixel message received: " + payload);
            return;
        }

        broadcast(payload);
    }

    private boolean isValidPixelMessage(PixelMessage pixelMessage) {
        if (pixelMessage == null) {
            return false;
        }

        if (pixelMessage.getIndex() < 0 ) {
            return false;
        }

        if (pixelMessage.getColor() == null) {
            return false;
        }

        return pixelMessage.getColor().matches(HEX_COLOR_PATTERN);
    }

    private void broadcast(String payload) throws Exception {
        for (WebSocketSession client : sessions) {
            if (client.isOpen()) {
                client.sendMessage(new TextMessage(payload));
            }
        }
    }
}