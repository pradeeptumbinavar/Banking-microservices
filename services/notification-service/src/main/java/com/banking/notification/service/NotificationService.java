package com.banking.notification.service;

import com.banking.notification.dto.NotificationRequest;
import com.banking.notification.dto.NotificationResponse;
import com.banking.notification.entity.Notification;
import com.banking.notification.enums.NotificationStatus;
import com.banking.notification.enums.NotificationType;
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
            .type(NotificationType.valueOf(request.getType().toUpperCase()))
            .recipient(request.getRecipient())
            .subject(request.getSubject())
            .message(request.getMessage())
            .status(NotificationStatus.PENDING)
            .build();
        
        notification = notificationRepository.save(notification);
        
        // Simulate sending (in real app, integrate with email/SMS providers)
        notification.setStatus(NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());
        notification = notificationRepository.save(notification);
        
        return toResponse(notification);
    }
    
    public NotificationResponse getNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        return toResponse(notification);
    }

    public java.util.List<Notification> getByUser(Long userId) {
        java.util.List<Notification> list = notificationRepository.findByUserId(userId);
        list.sort((a, b) -> {
            java.time.LocalDateTime ca = a.getCreatedAt();
            java.time.LocalDateTime cb = b.getCreatedAt();
            if (ca == null && cb == null) return 0;
            if (ca == null) return 1;
            if (cb == null) return -1;
            return cb.compareTo(ca);
        });
        return list;
    }
    
    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
            .id(notification.getId())
            .userId(notification.getUserId())
            .type(notification.getType().name())
            .recipient(notification.getRecipient())
            .subject(notification.getSubject())
            .message(notification.getMessage())
            .status(notification.getStatus().name())
            .createdAt(notification.getCreatedAt())
            .sentAt(notification.getSentAt())
            .seen(notification.isSeen())
            .seenAt(notification.getSeenAt())
            .build();
    }

    public long getUnseenCount(Long userId) {
        return notificationRepository.countByUserIdAndSeenFalse(userId);
    }

    @Transactional
    public void markSeen(Long id) {
        Notification n = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setSeen(true);
        n.setSeenAt(java.time.LocalDateTime.now());
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllSeen(Long userId) {
        java.util.List<Notification> list = notificationRepository.findByUserIdAndSeenFalse(userId);
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        for (Notification n : list) {
            n.setSeen(true);
            n.setSeenAt(now);
        }
        notificationRepository.saveAll(list);
    }
}

