package com.hostelhub.hostelhub.service;

import com.hostelhub.hostelhub.dto.HostelRequest;
import com.hostelhub.hostelhub.dto.HostelResponse;
import com.hostelhub.hostelhub.entity.Hostel;
import com.hostelhub.hostelhub.entity.User;
import com.hostelhub.hostelhub.enums.HostelStatus;
import com.hostelhub.hostelhub.repository.HostelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HostelService {

    private final HostelRepository hostelRepository;
    private final UserService userService;

    public HostelResponse createHostel(HostelRequest request) {
        User owner = userService.getCurrentUser();
        Hostel hostel = Hostel.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .description(request.getDescription())
                .contactNumber(request.getContactNumber())
                .imageUrl(request.getImageUrl())
                .status(HostelStatus.PENDING)
                .owner(owner)
                .build();
        return mapToResponse(hostelRepository.save(hostel));
    }

    @Transactional(readOnly = true)
    public List<HostelResponse> getAllApproved() {
        return hostelRepository.findByStatus(HostelStatus.APPROVED).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HostelResponse> searchByCity(String city) {
        return hostelRepository.findByCityIgnoreCaseAndStatus(city, HostelStatus.APPROVED).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HostelResponse getById(Long id) {
        return mapToResponse(hostelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hostel not found")));
    }

    @Transactional(readOnly = true)
    public List<HostelResponse> getMyHostels() {
        User owner = userService.getCurrentUser();
        return hostelRepository.findByOwner(owner).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public HostelResponse updateHostel(Long id, HostelRequest request) {
        User owner = userService.getCurrentUser();
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hostel not found"));
        if (!hostel.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to update this hostel");
        }
        hostel.setName(request.getName());
        hostel.setAddress(request.getAddress());
        hostel.setCity(request.getCity());
        hostel.setDescription(request.getDescription());
        hostel.setContactNumber(request.getContactNumber());
        hostel.setImageUrl(request.getImageUrl());
        return mapToResponse(hostelRepository.save(hostel));
    }

    public void deleteHostel(Long id) {
        User owner = userService.getCurrentUser();
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hostel not found"));
        if (!hostel.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to delete this hostel");
        }
        hostelRepository.delete(hostel);
    }

    // Admin
    public HostelResponse approveHostel(Long id) {
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hostel not found"));
        hostel.setStatus(HostelStatus.APPROVED);
        return mapToResponse(hostelRepository.save(hostel));
    }

    public HostelResponse rejectHostel(Long id) {
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hostel not found"));
        hostel.setStatus(HostelStatus.REJECTED);
        return mapToResponse(hostelRepository.save(hostel));
    }

    @Transactional(readOnly = true)
    public List<HostelResponse> getAllHostels() {
        return hostelRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private HostelResponse mapToResponse(Hostel hostel) {
        return HostelResponse.builder()
                .id(hostel.getId())
                .name(hostel.getName())
                .address(hostel.getAddress())
                .city(hostel.getCity())
                .description(hostel.getDescription())
                .contactNumber(hostel.getContactNumber())
                .imageUrl(hostel.getImageUrl())
                .status(hostel.getStatus())
                .ownerId(hostel.getOwner().getId())
                .ownerName(hostel.getOwner().getName())
                .createdAt(hostel.getCreatedAt())
                .build();
    }
}
