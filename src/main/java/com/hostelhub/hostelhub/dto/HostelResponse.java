package com.hostelhub.hostelhub.dto;

import com.hostelhub.hostelhub.enums.HostelStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HostelResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String description;
    private String contactNumber;
    private String imageUrl;
    private HostelStatus status;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
}
