package com.hrdashboard.controller;

import com.hrdashboard.model.Payroll;
import com.hrdashboard.service.PayrollService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @Data
    static class GenerateRequest {
        private String month;
        private int year;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<Payroll>> getAll() {
        return ResponseEntity.ok(payrollService.getAllPayroll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Payroll>> getMyPayslips() {
        return ResponseEntity.ok(payrollService.getMyPayslips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payroll> getPayslip(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.getPayslip(id));
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Payroll>> generate(@RequestBody GenerateRequest req) {
        return ResponseEntity.ok(payrollService.generatePayroll(req.getMonth(), req.getYear()));
    }
}
