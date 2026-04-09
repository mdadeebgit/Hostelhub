package com.hostelhub.hostelhub.service;

import com.hostelhub.hostelhub.dto.BookingRequest;
import com.hostelhub.hostelhub.dto.BookingResponse;
import com.hostelhub.hostelhub.entity.Booking;
import com.hostelhub.hostelhub.entity.Room;
import com.hostelhub.hostelhub.entity.User;
import com.hostelhub.hostelhub.enums.BookingStatus;
import com.hostelhub.hostelhub.repository.BookingRepository;
import com.hostelhub.hostelhub.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserService userService;

    public BookingResponse createBooking(BookingRequest request) {
        User student = userService.getCurrentUser();
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if (room.getAvailableSpots() <= 0) {
            throw new RuntimeException("No available spots in this room");
        }
        room.setAvailableSpots(room.getAvailableSpots() - 1);
        roomRepository.save(room);

        Booking booking = Booking.builder()
                .student(student)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .status(BookingStatus.PENDING)
                .build();
        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {
        User student = userService.getCurrentUser();
        return bookingRepository.findByStudent(student).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForOwner() {
        User owner = userService.getCurrentUser();
        return bookingRepository.findByRoomHostelOwner(owner).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public BookingResponse approveBooking(Long id) {
        User owner = userService.getCurrentUser();
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getRoom().getHostel().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to approve this booking");
        }
        booking.setStatus(BookingStatus.APPROVED);
        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponse rejectBooking(Long id) {
        User owner = userService.getCurrentUser();
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getRoom().getHostel().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to reject this booking");
        }
        restoreSpot(booking);
        booking.setStatus(BookingStatus.REJECTED);
        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponse cancelBooking(Long id) {
        User student = userService.getCurrentUser();
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Not authorized to cancel this booking");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }
        restoreSpot(booking);
        booking.setStatus(BookingStatus.CANCELLED);
        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private void restoreSpot(Booking booking) {
        Room room = booking.getRoom();
        room.setAvailableSpots(room.getAvailableSpots() + 1);
        roomRepository.save(room);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .studentId(booking.getStudent().getId())
                .studentName(booking.getStudent().getName())
                .studentEmail(booking.getStudent().getEmail())
                .roomId(booking.getRoom().getId())
                .roomNumber(booking.getRoom().getRoomNumber())
                .roomType(booking.getRoom().getType())
                .pricePerMonth(booking.getRoom().getPricePerMonth())
                .hostelId(booking.getRoom().getHostel().getId())
                .hostelName(booking.getRoom().getHostel().getName())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
