package com.hostelhub.hostelhub.repository;

import com.hostelhub.hostelhub.entity.Hostel;
import com.hostelhub.hostelhub.entity.Room;
import com.hostelhub.hostelhub.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHostel(Hostel hostel);
    List<Room> findByHostelAndType(Hostel hostel, RoomType type);
    List<Room> findByHostelAndAvailableSpotsGreaterThan(Hostel hostel, int spots);
}
