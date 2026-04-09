package com.hostelhub.hostelhub.dto;

import com.hostelhub.hostelhub.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private String hostelName;
    private String roomNumber;
    private String studentName;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private PaymentStatus status;
    private String transactionId;
    private LocalDateTime createdAt;
}
