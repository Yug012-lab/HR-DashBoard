package com.hrdashboard.repository;

import com.hrdashboard.model.Attendance;
import com.hrdashboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByUserAndDate(User user, LocalDate date);
    List<Attendance> findByUser(User user);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByUserOrderByDateDesc(User user);

    @Query("SELECT a FROM Attendance a WHERE a.date = :date AND a.checkInTime IS NOT NULL")
    List<Attendance> findCheckedInByDate(LocalDate date);

    long countByDateAndStatus(LocalDate date, Attendance.AttendanceStatus status);
}
