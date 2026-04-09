package com.hostelhub.hostelhub.controller;

import com.hostelhub.hostelhub.dto.HostelRequest;
import com.hostelhub.hostelhub.dto.HostelResponse;
import com.hostelhub.hostelhub.service.HostelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HostelController {

    private final HostelService hostelService;

    // Public endpoints
    @GetMapping("/api/public/hostels")
    public ResponseEntity<List<HostelResponse>> getAllApproved() {
        return ResponseEntity.ok(hostelService.getAllApproved());
    }

    @GetMapping("/api/public/hostels/search")
    public ResponseEntity<List<HostelResponse>> searchByCity(@RequestParam String city) {
        return ResponseEntity.ok(hostelService.searchByCity(city));
    }

    @GetMapping("/api/public/hostels/{id}")
    public ResponseEntity<HostelResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(hostelService.getById(id));
    }

    // Owner endpoints
    @PostMapping("/api/hostels")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<HostelResponse> createHostel(@Valid @RequestBody HostelRequest request) {
        return ResponseEntity.ok(hostelService.createHostel(request));
    }

    @GetMapping("/api/hostels/my")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<HostelResponse>> getMyHostels() {
        return ResponseEntity.ok(hostelService.getMyHostels());
    }

    @PutMapping("/api/hostels/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<HostelResponse> updateHostel(@PathVariable Long id,
                                                       @Valid @RequestBody HostelRequest request) {
        return ResponseEntity.ok(hostelService.updateHostel(id, request));
    }

    @DeleteMapping("/api/hostels/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteHostel(@PathVariable Long id) {
        hostelService.deleteHostel(id);
        return ResponseEntity.noContent().build();
    }

    // Admin endpoints
    @GetMapping("/api/admin/hostels")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<HostelResponse>> getAllHostels() {
        return ResponseEntity.ok(hostelService.getAllHostels());
    }

    @PutMapping("/api/admin/hostels/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HostelResponse> approveHostel(@PathVariable Long id) {
        return ResponseEntity.ok(hostelService.approveHostel(id));
    }

    @PutMapping("/api/admin/hostels/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HostelResponse> rejectHostel(@PathVariable Long id) {
        return ResponseEntity.ok(hostelService.rejectHostel(id));
    }
}
