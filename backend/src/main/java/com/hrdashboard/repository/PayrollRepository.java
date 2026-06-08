package com.hrdashboard.repository;

import com.hrdashboard.model.Payroll;
import com.hrdashboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByUser(User user);
    List<Payroll> findByUserOrderByYearDescMonthDesc(User user);
    List<Payroll> findByMonthAndYear(String month, Integer year);
    Optional<Payroll> findByUserAndMonthAndYear(User user, String month, Integer year);
}
