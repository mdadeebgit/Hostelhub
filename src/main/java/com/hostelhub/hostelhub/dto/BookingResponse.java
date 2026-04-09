package com.hostelhub.hostelhub.dto;

import com.hostelhub.hostelhub.enums.BookingStatus;
import com.hostelhub.hostelhub.enums.RoomType;
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
public class BookingResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long roomId;
    private String roomNumber;
    private RoomType roomType;
    private BigDecimal pricePerMonth;
    private Long hostelId;
    private String hostelName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BookingStatus status;
    private LocalDateTime createdAt;
}
