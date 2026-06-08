package com.hrdashboard.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;

    private String checkInLocation;
    private String checkOutLocation;

    private Double checkInLat;
    private Double checkInLng;
    private Double checkOutLat;
    private Double checkOutLng;

    private Double checkInConfidenceScore;
    private Double checkOutConfidenceScore;

    @Column(length = 512)
    private String checkInSelfieUrl;

    @Column(length = 512)
    private String checkOutSelfieUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AttendanceStatus status = AttendanceStatus.PRESENT;

    private Long workingMinutes;

    public enum AttendanceStatus { PRESENT, LATE, ABSENT, HALF_DAY }
}
