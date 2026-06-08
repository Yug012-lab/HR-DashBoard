package com.hrdashboard.service;

import com.hrdashboard.model.Leave;
import com.hrdashboard.model.User;
import com.hrdashboard.repository.LeaveRepository;
import com.hrdashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;

    private static final Map<Leave.LeaveType, Integer> ANNUAL_BALANCE = Map.of(
            Leave.LeaveType.CASUAL_LEAVE,    12,
            Leave.LeaveType.SICK_LEAVE,      10,
            Leave.LeaveType.EARNED_LEAVE,    15,
            Leave.LeaveType.MATERNITY_LEAVE, 90,
            Leave.LeaveType.PATERNITY_LEAVE, 15,
            Leave.LeaveType.UNPAID_LEAVE,    999
    );

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Leave applyLeave(Leave.LeaveType type, LocalDate from, LocalDate to, String reason) {
        User user = currentUser();
        int days = (int)(to.toEpochDay() - from.toEpochDay()) + 1;

        Leave leave = Leave.builder()
                .user(user)
                .leaveType(type)
                .fromDate(from)
                .toDate(to)
                .numberOfDays(days)
                .reason(reason)
                .status(Leave.LeaveStatus.PENDING)
                .build();

        return leaveRepository.save(leave);
    }

    public Leave approveLeave(Long id) {
        User approver = currentUser();
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));
        leave.setStatus(Leave.LeaveStatus.APPROVED);
        leave.setApprovedBy(approver);
        leave.setApprovedAt(LocalDateTime.now());
        return leaveRepository.save(leave);
    }

    public Leave rejectLeave(Long id, String reason) {
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));
        leave.setStatus(Leave.LeaveStatus.REJECTED);
        leave.setRejectionReason(reason);
        return leaveRepository.save(leave);
    }

    public List<Leave> getMyLeaves() {
        return leaveRepository.findByUserOrderByAppliedAtDesc(currentUser());
    }

    public List<Leave> getAllLeaves() {
        return leaveRepository.findAllByOrderByAppliedAtDesc();
    }

    public Map<String, Object> getMyBalance() {
        User user = currentUser();
        Map<String, Integer> balance = new java.util.LinkedHashMap<>();

        for (Leave.LeaveType type : Leave.LeaveType.values()) {
            long used = leaveRepository.countByUserAndLeaveTypeAndStatus(
                    user, type, Leave.LeaveStatus.APPROVED);
            int total = ANNUAL_BALANCE.getOrDefault(type, 0);
            balance.put(type.name(), (int) Math.max(total - used, 0));
        }

        return Map.of("balance", balance, "userId", user.getId());
    }
}
