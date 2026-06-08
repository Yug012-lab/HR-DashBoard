package com.hrdashboard.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String month;
    private Integer year;

    private Double basicSalary;
    private Double hra;
    private Double otherAllowances;
    private Double grossSalary;

    private Double pfDeduction;
    private Double esiDeduction;
    private Double taxDeduction;
    private Double otherDeductions;

    private Double netSalary;

    private Integer workingDays;
    private Integer presentDays;
    private Integer leaveDays;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PayrollStatus status = PayrollStatus.PROCESSING;

    private LocalDateTime processedAt;
    private LocalDateTime paidAt;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PayrollStatus { PROCESSING, PAID, ON_HOLD }
}
