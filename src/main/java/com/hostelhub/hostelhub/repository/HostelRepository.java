package com.hostelhub.hostelhub.repository;

import com.hostelhub.hostelhub.entity.Hostel;
import com.hostelhub.hostelhub.entity.User;
import com.hostelhub.hostelhub.enums.HostelStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, Long> {
    List<Hostel> findByStatus(HostelStatus status);
    List<Hostel> findByCityIgnoreCaseAndStatus(String city, HostelStatus status);
    List<Hostel> findByOwner(User owner);
}
