package com.hostelhub.hostelhub.service;

import com.hostelhub.hostelhub.dto.PaymentRequest;
import com.hostelhub.hostelhub.dto.PaymentResponse;
import com.hostelhub.hostelhub.entity.Booking;
import com.hostelhub.hostelhub.entity.Payment;
import com.hostelhub.hostelhub.entity.User;
import com.hostelhub.hostelhub.enums.PaymentStatus;
import com.hostelhub.hostelhub.repository.BookingRepository;
import com.hostelhub.hostelhub.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;

    public PaymentResponse recordPayment(PaymentRequest request) {
        User student = userService.getCurrentUser();
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Not authorized to pay for this booking");
        }
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(request.getAmount())
                .paymentDate(request.getPaymentDate())
                .status(PaymentStatus.PAID)
                .transactionId(request.getTransactionId())
                .build();
        return mapToResponse(paymentRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getMyPayments() {
        User student = userService.getCurrentUser();
        return paymentRepository.findByBookingStudentId(student.getId()).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .hostelName(payment.getBooking().getRoom().getHostel().getName())
                .roomNumber(payment.getBooking().getRoom().getRoomNumber())
                .studentName(payment.getBooking().getStudent().getName())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
