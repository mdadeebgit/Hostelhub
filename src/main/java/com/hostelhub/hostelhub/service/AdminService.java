package com.hostelhub.hostelhub.service;

import com.hostelhub.hostelhub.dto.AdminStatsResponse;
import com.hostelhub.hostelhub.enums.BookingStatus;
import com.hostelhub.hostelhub.enums.HostelStatus;
import com.hostelhub.hostelhub.enums.PaymentStatus;
import com.hostelhub.hostelhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final HostelRepository hostelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public AdminStatsResponse getStats() {
        BigDecimal totalRevenue = paymentRepository.findByStatus(PaymentStatus.PAID).stream()
                .map(p -> p.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalHostels(hostelRepository.count())
                .approvedHostels(hostelRepository.findByStatus(HostelStatus.APPROVED).size())
                .totalRooms(roomRepository.count())
                .totalBookings(bookingRepository.count())
                .activeBookings(bookingRepository.countByStatus(BookingStatus.APPROVED))
                .totalPayments(paymentRepository.count())
                .totalRevenue(totalRevenue)
                .build();
    }
}
