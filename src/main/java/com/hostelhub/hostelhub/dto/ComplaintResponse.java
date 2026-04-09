package com.hostelhub.hostelhub.dto;

import com.hostelhub.hostelhub.enums.ComplaintStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long hostelId;
    private String hostelName;
    private String title;
    private String description;
    private ComplaintStatus status;
    private LocalDateTime createdAt;
}
