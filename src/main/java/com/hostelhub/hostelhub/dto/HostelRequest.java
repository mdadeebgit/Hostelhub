package com.hostelhub.hostelhub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HostelRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private String description;
    private String contactNumber;
    private String imageUrl;
}
