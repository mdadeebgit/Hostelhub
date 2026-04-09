package com.hostelhub.hostelhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalHostels;
    private long approvedHostels;
    private long totalRooms;
    private long totalBookings;
    private long activeBookings;
    private long totalPayments;
    private BigDecimal totalRevenue;
}
