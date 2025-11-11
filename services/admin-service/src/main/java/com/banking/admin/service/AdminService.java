package com.banking.admin.service;

import com.banking.admin.dto.ApprovalRequest;
import com.banking.admin.dto.ApprovalResponse;
import com.banking.admin.feign.AccountServiceClient;
import com.banking.admin.feign.CreditServiceClient;
import com.banking.admin.feign.CustomerServiceClient;
import com.banking.admin.feign.PaymentServiceClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {
    
    private static final Logger log = LoggerFactory.getLogger(AdminService.class);
    
    private final CustomerServiceClient customerServiceClient;
    private final AccountServiceClient accountServiceClient;
    private final CreditServiceClient creditServiceClient;
    private final PaymentServiceClient paymentServiceClient;
    private final com.banking.admin.feign.NotificationServiceClient notificationServiceClient;

    public AdminService(
            CustomerServiceClient customerServiceClient,
            AccountServiceClient accountServiceClient,
            CreditServiceClient creditServiceClient,
            PaymentServiceClient paymentServiceClient,
            com.banking.admin.feign.NotificationServiceClient notificationServiceClient) {
        this.customerServiceClient = customerServiceClient;
        this.accountServiceClient = accountServiceClient;
        this.creditServiceClient = creditServiceClient;
        this.paymentServiceClient = paymentServiceClient;
        this.notificationServiceClient = notificationServiceClient;
    }
    
    @CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackEmptyList")
    public List<ApprovalResponse> getCustomerPendingApprovals() {
        return customerServiceClient.getPendingApprovals();
    }

    public String bulkApproveCustomers(ApprovalRequest request) {
        String result = customerServiceClient.bulkApprove(request);
        // Best-effort notifications for each customer id
        if (request != null && request.getIds() != null) {
            for (Long id : request.getIds()) {
                try {
                    var cust = customerServiceClient.getCustomer(id);
                    if (cust != null && cust.getUserId() != null) {
                        String subject = "KYC " + request.getStatus().toUpperCase();
                        String message = "Your KYC request (Customer ID: " + id + ") has been " + request.getStatus().toUpperCase() + ".";
                        var nreq = new com.banking.admin.dto.NotificationRequest(
                                cust.getUserId(),
                                "PUSH",
                                cust.getEmail() != null ? cust.getEmail() : String.valueOf(cust.getUserId()),
                                subject,
                                message
                        );
                        notificationServiceClient.send(nreq);
                    }
                } catch (Exception e) {
                    // swallow; don't block approvals on notification failure
                }
            }
        }
        return result;
    }

    @CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackEmptyList")
    public List<ApprovalResponse> getAccountPendingApprovals() {
        return accountServiceClient.getPendingApprovals();
    }

    public String bulkApproveAccounts(ApprovalRequest request) {
        String result = accountServiceClient.bulkApprove(request);
        if (request != null && request.getIds() != null) {
            for (Long id : request.getIds()) {
                try {
                    var acc = accountServiceClient.getAccount(id);
                    if (acc != null && acc.getCustomerId() != null) {
                        var cust = customerServiceClient.getCustomer(acc.getCustomerId());
                        if (cust != null && cust.getUserId() != null) {
                            String subject = "Account " + request.getStatus().toUpperCase();
                            String message = "Your account (ID: " + id + ") status updated to " + request.getStatus().toUpperCase() + ".";
                            var nreq = new com.banking.admin.dto.NotificationRequest(
                                    cust.getUserId(),
                                    "PUSH",
                                    cust.getEmail() != null ? cust.getEmail() : String.valueOf(cust.getUserId()),
                                    subject,
                                    message
                            );
                            notificationServiceClient.send(nreq);
                        }
                    }
                } catch (Exception ignored) { }
            }
        }
        return result;
    }

    @CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackEmptyList")
    public List<ApprovalResponse> getCreditPendingApprovals() {
        return creditServiceClient.getPendingApprovals();
    }

    public String bulkApproveCredits(ApprovalRequest request) {
        String result = creditServiceClient.bulkApprove(request);
        if (request != null && request.getIds() != null) {
            for (Long id : request.getIds()) {
                try {
                    var credit = creditServiceClient.getCredit(id);
                    if (credit != null && credit.getCustomerId() != null) {
                        var cust = customerServiceClient.getCustomer(credit.getCustomerId());
                        if (cust != null && cust.getUserId() != null) {
                            String typeLabel = (credit.getProductType() != null && credit.getProductType().toUpperCase().contains("CARD"))
                                    ? "Card"
                                    : "Loan";
                            if ("Loan".equals(typeLabel) && credit.getLoanType() != null) {
                                typeLabel = credit.getLoanType().charAt(0) + credit.getLoanType().substring(1).toLowerCase() + " Loan";
                            } else if ("Card".equals(typeLabel) && credit.getCardType() != null) {
                                typeLabel = credit.getCardType().charAt(0) + credit.getCardType().substring(1).toLowerCase() + " Card";
                            }
                            String statusUp = request.getStatus().toUpperCase();
                            String subject = typeLabel + " " + statusUp;
                            String message = "Your " + typeLabel.toLowerCase() + " (ID: " + id + ") is " + statusUp + ".";
                            var nreq = new com.banking.admin.dto.NotificationRequest(
                                    cust.getUserId(),
                                    "PUSH",
                                    cust.getEmail() != null ? cust.getEmail() : String.valueOf(cust.getUserId()),
                                    subject,
                                    message
                            );
                            notificationServiceClient.send(nreq);
                        }
                    }
                } catch (Exception ignored) { }
            }
        }
        return result;
    }

    @CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackEmptyList")
    public List<ApprovalResponse> getPaymentPendingApprovals() {
        return paymentServiceClient.getPendingApprovals();
    }

    public String bulkApprovePayments(ApprovalRequest request) {
        String result = paymentServiceClient.bulkApprove(request);
        if (request != null && request.getIds() != null) {
            for (Long id : request.getIds()) {
                try {
                    var payment = paymentServiceClient.getPayment(id);
                    Long fromAccId = payment != null ? payment.getFromAccountId() : null;
                    if (fromAccId != null) {
                        var acc = accountServiceClient.getAccount(fromAccId);
                        if (acc != null && acc.getCustomerId() != null) {
                            var cust = customerServiceClient.getCustomer(acc.getCustomerId());
                            if (cust != null && cust.getUserId() != null) {
                                String statusUp = request.getStatus().toUpperCase();
                                String subject = "Payment " + statusUp;
                                String amount = payment.getAmount() != null ? payment.getAmount().toPlainString() : "";
                                String currency = payment.getCurrency() != null ? payment.getCurrency() : "";
                                String message = "Your payment (ID: " + id + ") for " + amount + " " + currency + " is " + statusUp + ".";
                                var nreq = new com.banking.admin.dto.NotificationRequest(
                                        cust.getUserId(),
                                        "PUSH",
                                        cust.getEmail() != null ? cust.getEmail() : String.valueOf(cust.getUserId()),
                                        subject,
                                        message
                                );
                                notificationServiceClient.send(nreq);
                            }
                        }
                    }
                } catch (Exception ignored) { }
            }
        }
        return result;
    }

    private List<ApprovalResponse> fallbackEmptyList(Exception e) {
        log.error("Circuit breaker fallback: {}", e.getMessage());
        return new ArrayList<>();
    }

    // Insights: fetch-all aggregations (no filtering)
    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackCustomers")
    public java.util.List<com.banking.admin.feign.dto.CustomerResponse> getAllCustomers() {
        return customerServiceClient.getAllCustomers();
    }

    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackAccounts")
    public java.util.List<com.banking.admin.feign.dto.AccountResponse> getAllAccounts() {
        return accountServiceClient.getAllAccounts();
    }

    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackPayments")
    public java.util.List<com.banking.admin.feign.dto.PaymentResponse> getAllPayments() {
        return paymentServiceClient.getAllPayments();
    }

    @io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker(name = "admin-service", fallbackMethod = "fallbackCredits")
    public java.util.List<com.banking.admin.feign.dto.CreditProductResponse> getAllCredits() {
        return creditServiceClient.getAllCredits();
    }

    // Fallbacks for insights fetch-all endpoints
    private java.util.List<com.banking.admin.feign.dto.CustomerResponse> fallbackCustomers(Exception e) {
        log.error("Insights fallback (customers): {}", e.getMessage());
        return new ArrayList<>();
    }

    private java.util.List<com.banking.admin.feign.dto.AccountResponse> fallbackAccounts(Exception e) {
        log.error("Insights fallback (accounts): {}", e.getMessage());
        return new ArrayList<>();
    }

    private java.util.List<com.banking.admin.feign.dto.PaymentResponse> fallbackPayments(Exception e) {
        log.error("Insights fallback (payments): {}", e.getMessage());
        return new ArrayList<>();
    }

    private java.util.List<com.banking.admin.feign.dto.CreditProductResponse> fallbackCredits(Exception e) {
        log.error("Insights fallback (credits): {}", e.getMessage());
        return new ArrayList<>();
    }
}
