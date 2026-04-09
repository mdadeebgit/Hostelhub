package com.hostelhub.hostelhub.repository;

import com.hostelhub.hostelhub.entity.Complaint;
import com.hostelhub.hostelhub.entity.User;
import com.hostelhub.hostelhub.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStudent(User student);
    List<Complaint> findByHostelOwner(User owner);
    List<Complaint> findByStatus(ComplaintStatus status);
}
