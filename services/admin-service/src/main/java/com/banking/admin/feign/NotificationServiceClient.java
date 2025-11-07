package com.banking.admin.feign;

import com.banking.admin.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "notification-service",
    path = "/notifications",
    configuration = com.banking.admin.config.FeignConfig.class
)
public interface NotificationServiceClient {

    @PostMapping("/send")
    Object send(@RequestBody NotificationRequest request);
}

