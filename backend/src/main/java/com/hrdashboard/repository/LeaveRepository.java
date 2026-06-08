package com.hrdashboard.repository;

import com.hrdashboard.model.Leave;
import com.hrdashboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByUser(User user);
    List<Leave> findByUserOrderByAppliedAtDesc(User user);
    List<Leave> findByStatus(Leave.LeaveStatus status);
    List<Leave> findAllByOrderByAppliedAtDesc();
    long countByUserAndLeaveTypeAndStatus(User user, Leave.LeaveType type, Leave.LeaveStatus status);
}
