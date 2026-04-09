package com.hostelhub.hostelhub.service;

import com.hostelhub.hostelhub.dto.ComplaintRequest;
import com.hostelhub.hostelhub.dto.ComplaintResponse;
import com.hostelhub.hostelhub.entity.Complaint;
import com.hostelhub.hostelhub.entity.Hostel;
import com.hostelhub.hostelhub.entity.User;
import com.hostelhub.hostelhub.enums.ComplaintStatus;
import com.hostelhub.hostelhub.repository.ComplaintRepository;
import com.hostelhub.hostelhub.repository.HostelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final HostelRepository hostelRepository;
    private final UserService userService;

    public ComplaintResponse raiseComplaint(ComplaintRequest request) {
        User student = userService.getCurrentUser();
        Hostel hostel = hostelRepository.findById(request.getHostelId())
                .orElseThrow(() -> new RuntimeException("Hostel not found"));
        Complaint complaint = Complaint.builder()
                .student(student)
                .hostel(hostel)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(ComplaintStatus.OPEN)
                .build();
        return mapToResponse(complaintRepository.save(complaint));
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints() {
        User student = userService.getCurrentUser();
        return complaintRepository.findByStudent(student).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getComplaintsForOwner() {
        User owner = userService.getCurrentUser();
        return complaintRepository.findByHostelOwner(owner).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public ComplaintResponse updateStatus(Long id, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        return mapToResponse(complaintRepository.save(complaint));
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .studentId(complaint.getStudent().getId())
                .studentName(complaint.getStudent().getName())
                .hostelId(complaint.getHostel().getId())
                .hostelName(complaint.getHostel().getName())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .status(complaint.getStatus())
                .createdAt(complaint.getCreatedAt())
                .build();
    }
}
