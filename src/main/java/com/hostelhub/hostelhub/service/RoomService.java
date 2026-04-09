package com.hostelhub.hostelhub.service;

import com.hostelhub.hostelhub.dto.RoomRequest;
import com.hostelhub.hostelhub.dto.RoomResponse;
import com.hostelhub.hostelhub.entity.Hostel;
import com.hostelhub.hostelhub.entity.Room;
import com.hostelhub.hostelhub.entity.User;
import com.hostelhub.hostelhub.repository.HostelRepository;
import com.hostelhub.hostelhub.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;
    private final HostelRepository hostelRepository;
    private final UserService userService;

    public RoomResponse addRoom(RoomRequest request) {
        User owner = userService.getCurrentUser();
        Hostel hostel = hostelRepository.findById(request.getHostelId())
                .orElseThrow(() -> new RuntimeException("Hostel not found"));
        if (!hostel.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to add rooms to this hostel");
        }
        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .type(request.getType())
                .capacity(request.getCapacity())
                .availableSpots(request.getCapacity())
                .pricePerMonth(request.getPricePerMonth())
                .amenities(request.getAmenities())
                .imageUrl(request.getImageUrl())
                .hostel(hostel)
                .build();
        return mapToResponse(roomRepository.save(room));
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getRoomsByHostel(Long hostelId) {
        Hostel hostel = hostelRepository.findById(hostelId)
                .orElseThrow(() -> new RuntimeException("Hostel not found"));
        return roomRepository.findByHostel(hostel).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long id) {
        return mapToResponse(roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found")));
    }

    public RoomResponse updateRoom(Long id, RoomRequest request) {
        User owner = userService.getCurrentUser();
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if (!room.getHostel().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to update this room");
        }
        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setCapacity(request.getCapacity());
        room.setPricePerMonth(request.getPricePerMonth());
        room.setAmenities(request.getAmenities());
        room.setImageUrl(request.getImageUrl());
        return mapToResponse(roomRepository.save(room));
    }

    public void deleteRoom(Long id) {
        User owner = userService.getCurrentUser();
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if (!room.getHostel().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to delete this room");
        }
        roomRepository.delete(room);
    }

    private RoomResponse mapToResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .type(room.getType())
                .capacity(room.getCapacity())
                .availableSpots(room.getAvailableSpots())
                .pricePerMonth(room.getPricePerMonth())
                .amenities(room.getAmenities())
                .imageUrl(room.getImageUrl())
                .hostelId(room.getHostel().getId())
                .hostelName(room.getHostel().getName())
                .hostelCity(room.getHostel().getCity())
                .createdAt(room.getCreatedAt())
                .build();
    }
}
