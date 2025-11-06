package com.banking.notification.service;

import com.banking.notification.dto.NotificationRequest;
import com.banking.notification.dto.NotificationResponse;
import com.banking.notification.entity.Notification;
import com.banking.notification.enums.NotificationStatus;
import com.banking.notification.enums.NotificationType;
import com.banking.notification.repository.NotificationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTests {

    @Mock private NotificationRepository repo;
    @InjectMocks private NotificationService service;

    @Test
    @DisplayName("sendNotification sets SENT and sentAt")
    void sendNotification_ok() {
        when(repo.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));
        NotificationRequest req = new NotificationRequest(1L, "EMAIL", "a@b.com", "s", "m");

        NotificationResponse resp = service.sendNotification(req);

        assertEquals("SENT", resp.getStatus());
        assertNotNull(resp.getSentAt());
    }

    @Test
    @DisplayName("getNotification throws when not found")
    void getNotification_notFound() {
        when(repo.findById(9L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getNotification(9L));
    }
}

