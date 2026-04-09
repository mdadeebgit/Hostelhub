package com.hostelhub.hostelhub.controller;

import com.hostelhub.hostelhub.dto.RoomRequest;
import com.hostelhub.hostelhub.dto.RoomResponse;
import com.hostelhub.hostelhub.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // Public endpoints
    @GetMapping("/api/public/hostels/{hostelId}/rooms")
    public ResponseEntity<List<RoomResponse>> getRoomsByHostel(@PathVariable Long hostelId) {
        return ResponseEntity.ok(roomService.getRoomsByHostel(hostelId));
    }

    @GetMapping("/api/public/rooms/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    // Owner endpoints
    @PostMapping("/api/rooms")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<RoomResponse> addRoom(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.addRoom(request));
    }

    @PutMapping("/api/rooms/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id,
                                                   @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @DeleteMapping("/api/rooms/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
