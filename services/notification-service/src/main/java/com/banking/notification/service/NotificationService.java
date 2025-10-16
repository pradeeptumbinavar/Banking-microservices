package com.banking.notification.service;

import com.banking.notification.dto.NotificationRequest;
import com.banking.notification.dto.NotificationResponse;
import com.banking.notification.entity.Notification;
import com.banking.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    @Transactional
    public NotificationResponse sendNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
            .userId(request.getUserId())
            .type(request.getType())
            .recipient(request.getRecipient())
            .subject(request.getSubject())
            .message(request.getMessage())
            .status("PENDING")
            .build();
        
        notification = notificationRepository.save(notification);
        
        // Simulate sending (in real app, integrate with email/SMS providers)
        notification.setStatus("SENT");
        notification.setSentAt(LocalDateTime.now());
        notification = notificationRepository.save(notification);
        
        return toResponse(notification);
    }
    
    public NotificationResponse getNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        return toResponse(notification);
    }
    
    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
            .id(notification.getId())
            .userId(notification.getUserId())
            .type(notification.getType())
            .recipient(notification.getRecipient())
            .subject(notification.getSubject())
            .message(notification.getMessage())
            .status(notification.getStatus())
            .createdAt(notification.getCreatedAt())
            .sentAt(notification.getSentAt())
            .build();
    }
}

