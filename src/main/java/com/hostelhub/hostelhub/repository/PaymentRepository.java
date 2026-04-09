package com.hostelhub.hostelhub.repository;

import com.hostelhub.hostelhub.entity.Booking;
import com.hostelhub.hostelhub.entity.Payment;
import com.hostelhub.hostelhub.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBooking(Booking booking);
    List<Payment> findByBookingStudentId(Long studentId);
    List<Payment> findByStatus(PaymentStatus status);
}
