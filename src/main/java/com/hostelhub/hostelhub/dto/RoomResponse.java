package com.hostelhub.hostelhub.dto;

import com.hostelhub.hostelhub.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private RoomType type;
    private Integer capacity;
    private Integer availableSpots;
    private BigDecimal pricePerMonth;
    private String amenities;
    private String imageUrl;
    private Long hostelId;
    private String hostelName;
    private String hostelCity;
    private LocalDateTime createdAt;
}
