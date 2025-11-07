package com.banking.notification.controller;

import com.banking.notification.dto.NotificationRequest;
import com.banking.notification.dto.NotificationResponse;
import com.banking.notification.entity.Notification;
import com.banking.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification", description = "Notification delivery APIs")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @PostMapping("/send")
    @Operation(summary = "Send notification")
    public ResponseEntity<NotificationResponse> sendNotification(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.sendNotification(request));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get notification by ID")
    public ResponseEntity<NotificationResponse> getNotification(@PathVariable("id") Long id) {
        return ResponseEntity.ok(notificationService.getNotification(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<java.util.List<NotificationResponse>> getByUser(@PathVariable("userId") Long userId) {
        java.util.List<Notification> list = notificationService.getByUser(userId);
        java.util.List<NotificationResponse> out = list.stream().map(n -> NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .type(n.getType().name())
                .recipient(n.getRecipient())
                .subject(n.getSubject())
                .message(n.getMessage())
                .status(n.getStatus().name())
                .createdAt(n.getCreatedAt())
                .sentAt(n.getSentAt())
                .seen(n.isSeen())
                .seenAt(n.getSeenAt())
                .build()).toList();
        return ResponseEntity.ok(out);
    }

    @GetMapping("/user/{userId}/unseen-count")
    public ResponseEntity<Long> unseenCount(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(notificationService.getUnseenCount(userId));
    }

    @PutMapping("/{id}/seen")
    public ResponseEntity<Void> markSeen(@PathVariable("id") Long id) {
        notificationService.markSeen(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{userId}/seen-all")
    public ResponseEntity<Void> markAllSeen(@PathVariable("userId") Long userId) {
        notificationService.markAllSeen(userId);
        return ResponseEntity.ok().build();
    }
}

