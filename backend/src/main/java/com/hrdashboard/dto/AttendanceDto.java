package com.hrdashboard.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceDto {

    @Data
    public static class CheckInRequest {
        private String selfieBase64;
        private Double lat;
        private Double lng;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttendanceResponse {
        private Long id;
        private Long userId;
        private String userName;
        private LocalDate date;
        private LocalDateTime checkInTime;
        private LocalDateTime checkOutTime;
        private String status;
        private String checkInLocation;
        private String checkOutLocation;
        private Double checkInConfidenceScore;
        private Double checkOutConfidenceScore;
        private Long workingMinutes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsResponse {
        private long totalEmployees;
        private long presentToday;
        private long lateToday;
        private long absentToday;
        private double attendanceRate;
    }
}
