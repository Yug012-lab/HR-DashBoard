package com.hrdashboard.service;

import com.hrdashboard.dto.AttendanceDto;
import com.hrdashboard.model.Attendance;
import com.hrdashboard.model.User;
import com.hrdashboard.repository.AttendanceRepository;
import com.hrdashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    private static final LocalTime WORK_START = LocalTime.of(9, 0);
    private static final LocalTime LATE_THRESHOLD = LocalTime.of(9, 15);

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AttendanceDto.AttendanceResponse checkIn(AttendanceDto.CheckInRequest req) {
        User user = currentUser();
        LocalDate today = LocalDate.now();

        if (attendanceRepository.findByUserAndDate(user, today).isPresent()) {
            throw new RuntimeException("Already checked in today");
        }

        LocalDateTime now = LocalDateTime.now();
        Attendance.AttendanceStatus status = now.toLocalTime().isAfter(LATE_THRESHOLD)
                ? Attendance.AttendanceStatus.LATE
                : Attendance.AttendanceStatus.PRESENT;

        String location = resolveLocation(req.getLat(), req.getLng());

        Attendance attendance = Attendance.builder()
                .user(user)
                .date(today)
                .checkInTime(now)
                .checkInLat(req.getLat())
                .checkInLng(req.getLng())
                .checkInLocation(location)
                .checkInConfidenceScore(simulateFaceConfidence())
                .status(status)
                .build();

        attendance = attendanceRepository.save(attendance);
        return toResponse(attendance);
    }

    public AttendanceDto.AttendanceResponse checkOut(AttendanceDto.CheckInRequest req) {
        User user = currentUser();
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByUserAndDate(user, today)
                .orElseThrow(() -> new RuntimeException("No check-in found for today"));

        if (attendance.getCheckOutTime() != null) {
            throw new RuntimeException("Already checked out today");
        }

        LocalDateTime now = LocalDateTime.now();
        long workingMinutes = java.time.Duration.between(attendance.getCheckInTime(), now).toMinutes();

        attendance.setCheckOutTime(now);
        attendance.setCheckOutLat(req.getLat());
        attendance.setCheckOutLng(req.getLng());
        attendance.setCheckOutLocation(resolveLocation(req.getLat(), req.getLng()));
        attendance.setCheckOutConfidenceScore(simulateFaceConfidence());
        attendance.setWorkingMinutes(workingMinutes);

        attendance = attendanceRepository.save(attendance);
        return toResponse(attendance);
    }

    public List<AttendanceDto.AttendanceResponse> getMyAttendance() {
        User user = currentUser();
        return attendanceRepository.findByUserOrderByDateDesc(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AttendanceDto.AttendanceResponse getTodayAttendance() {
        User user = currentUser();
        return attendanceRepository.findByUserAndDate(user, LocalDate.now())
                .map(this::toResponse)
                .orElse(null);
    }

    public List<AttendanceDto.AttendanceResponse> getAllAttendance() {
        return attendanceRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AttendanceDto.StatsResponse getStats() {
        LocalDate today = LocalDate.now();
        long total   = userRepository.countByStatus(User.Status.ACTIVE);
        long present = attendanceRepository.countByDateAndStatus(today, Attendance.AttendanceStatus.PRESENT);
        long late    = attendanceRepository.countByDateAndStatus(today, Attendance.AttendanceStatus.LATE);
        long absent  = total - present - late;
        double rate  = total > 0 ? Math.round(((double)(present + late) / total) * 100.0) : 0;

        return AttendanceDto.StatsResponse.builder()
                .totalEmployees(total)
                .presentToday(present)
                .lateToday(late)
                .absentToday(Math.max(absent, 0))
                .attendanceRate(rate)
                .build();
    }

    private String resolveLocation(Double lat, Double lng) {
        if (lat == null || lng == null) return "Unknown";
        // Simple bounding-box for known offices — extend as needed
        if (lat >= 28.5 && lat <= 28.8 && lng >= 77.0 && lng <= 77.4) return "Office - Delhi";
        return String.format("Remote (%.4f, %.4f)", lat, lng);
    }

    private double simulateFaceConfidence() {
        // Replace with real face-API call in production
        return 94.0 + Math.random() * 5.5;
    }

    private AttendanceDto.AttendanceResponse toResponse(Attendance a) {
        return AttendanceDto.AttendanceResponse.builder()
                .id(a.getId())
                .userId(a.getUser().getId())
                .userName(a.getUser().getName())
                .date(a.getDate())
                .checkInTime(a.getCheckInTime())
                .checkOutTime(a.getCheckOutTime())
                .status(a.getStatus().name())
                .checkInLocation(a.getCheckInLocation())
                .checkOutLocation(a.getCheckOutLocation())
                .checkInConfidenceScore(a.getCheckInConfidenceScore())
                .checkOutConfidenceScore(a.getCheckOutConfidenceScore())
                .workingMinutes(a.getWorkingMinutes())
                .build();
    }
}
