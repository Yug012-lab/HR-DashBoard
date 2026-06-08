package com.hrdashboard.service;

import com.hrdashboard.model.Payroll;
import com.hrdashboard.model.User;
import com.hrdashboard.repository.PayrollRepository;
import com.hrdashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final UserRepository userRepository;

    private static final double PF_RATE   = 0.12;
    private static final double ESI_RATE  = 0.0075;
    private static final double HRA_RATE  = 0.40;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Payroll> generatePayroll(String month, int year) {
        List<User> employees = userRepository.findByStatus(User.Status.ACTIVE);

        for (User emp : employees) {
            if (payrollRepository.findByUserAndMonthAndYear(emp, month, year).isPresent()) continue;

            // Basic salary from designation (demo logic — replace with salary table)
            double basic = getBasicSalary(emp);
            double hra   = basic * HRA_RATE;
            double gross = basic + hra;

            double pf    = basic * PF_RATE;
            double esi   = gross * ESI_RATE;
            double tax   = calculateTax(gross * 12) / 12;

            double net = gross - pf - esi - tax;

            Payroll payroll = Payroll.builder()
                    .user(emp)
                    .month(month)
                    .year(year)
                    .basicSalary(basic)
                    .hra(hra)
                    .grossSalary(gross)
                    .pfDeduction(Math.round(pf * 100.0) / 100.0)
                    .esiDeduction(Math.round(esi * 100.0) / 100.0)
                    .taxDeduction(Math.round(tax * 100.0) / 100.0)
                    .netSalary(Math.round(net * 100.0) / 100.0)
                    .workingDays(26)
                    .presentDays(24)
                    .leaveDays(2)
                    .status(Payroll.PayrollStatus.PROCESSING)
                    .processedAt(LocalDateTime.now())
                    .build();

            payrollRepository.save(payroll);
        }

        return payrollRepository.findByMonthAndYear(month, year);
    }

    public List<Payroll> getAllPayroll() {
        return payrollRepository.findAll();
    }

    public List<Payroll> getMyPayslips() {
        return payrollRepository.findByUserOrderByYearDescMonthDesc(currentUser());
    }

    public Payroll getPayslip(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll record not found"));
    }

    private double getBasicSalary(User user) {
        if (user.getDesignation() == null) return 40000;
        String d = user.getDesignation().toLowerCase();
        if (d.contains("head") || d.contains("vp") || d.contains("director")) return 150000;
        if (d.contains("senior") || d.contains("lead"))                        return 90000;
        if (d.contains("manager"))                                              return 80000;
        if (d.contains("analyst") || d.contains("designer"))                   return 60000;
        return 45000;
    }

    private double calculateTax(double annualGross) {
        // Simplified Indian slab (new regime)
        if (annualGross <= 300000)  return 0;
        if (annualGross <= 600000)  return (annualGross - 300000) * 0.05;
        if (annualGross <= 900000)  return 15000 + (annualGross - 600000) * 0.10;
        if (annualGross <= 1200000) return 45000 + (annualGross - 900000) * 0.15;
        return 90000 + (annualGross - 1200000) * 0.20;
    }
}
