package com.hrdashboard.controller;

import com.hrdashboard.dto.AttendanceDto;
import com.hrdashboard.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/checkin")
    public ResponseEntity<AttendanceDto.AttendanceResponse> checkIn(
            @RequestBody AttendanceDto.CheckInRequest req) {
        return ResponseEntity.ok(attendanceService.checkIn(req));
    }

    @PostMapping("/checkout")
    public ResponseEntity<AttendanceDto.AttendanceResponse> checkOut(
            @RequestBody AttendanceDto.CheckInRequest req) {
        return ResponseEntity.ok(attendanceService.checkOut(req));
    }

    @GetMapping("/today")
    public ResponseEntity<AttendanceDto.AttendanceResponse> getToday() {
        return ResponseEntity.ok(attendanceService.getTodayAttendance());
    }

    @GetMapping("/my")
    public ResponseEntity<List<AttendanceDto.AttendanceResponse>> getMyAttendance() {
        return ResponseEntity.ok(attendanceService.getMyAttendance());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<AttendanceDto.AttendanceResponse>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<AttendanceDto.StatsResponse> getStats() {
        return ResponseEntity.ok(attendanceService.getStats());
    }
}
