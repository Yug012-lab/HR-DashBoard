package com.hrdashboard.controller;

import com.hrdashboard.model.Leave;
import com.hrdashboard.service.LeaveService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @Data
    static class ApplyRequest {
        private String leaveType;
        private String fromDate;
        private String toDate;
        private String reason;
    }

    @Data
    static class RejectRequest {
        private String reason;
    }

    @PostMapping("/apply")
    public ResponseEntity<Leave> apply(@RequestBody ApplyRequest req) {
        Leave leave = leaveService.applyLeave(
                Leave.LeaveType.valueOf(req.getLeaveType().toUpperCase().replace(" ", "_")),
                LocalDate.parse(req.getFromDate()),
                LocalDate.parse(req.getToDate()),
                req.getReason()
        );
        return ResponseEntity.ok(leave);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Leave>> getMyLeaves() {
        return ResponseEntity.ok(leaveService.getMyLeaves());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Leave>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<Leave> approve(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.approveLeave(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<Leave> reject(@PathVariable Long id, @RequestBody RejectRequest req) {
        return ResponseEntity.ok(leaveService.rejectLeave(id, req.getReason()));
    }

    @GetMapping("/balance")
    public ResponseEntity<Map<String, Object>> getBalance() {
        return ResponseEntity.ok(leaveService.getMyBalance());
    }
}
