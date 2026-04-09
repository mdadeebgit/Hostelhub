package com.hostelhub.hostelhub.repository;

import com.hostelhub.hostelhub.entity.Booking;
import com.hostelhub.hostelhub.entity.Room;
import com.hostelhub.hostelhub.entity.User;
import com.hostelhub.hostelhub.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStudent(User student);
    List<Booking> findByStudentAndStatus(User student, BookingStatus status);
    List<Booking> findByRoomHostelOwner(User owner);
    List<Booking> findByRoomHostelOwnerAndStatus(User owner, BookingStatus status);
    List<Booking> findByRoom(Room room);
    List<Booking> findByStatus(BookingStatus status);
    long countByStatus(BookingStatus status);
}
