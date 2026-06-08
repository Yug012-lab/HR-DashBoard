package com.hrdashboard.config;

import com.hrdashboard.model.User;
import com.hrdashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return; // Already seeded

        log.info("Seeding initial data...");

        List<User> users = List.of(
            User.builder()
                .name("Admin User")
                .email("admin@hrdashboard.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(User.Role.ADMIN)
                .department("Administration")
                .designation("System Administrator")
                .phone("+91 98765 00001")
                .joinDate(LocalDate.of(2020, 1, 1))
                .status(User.Status.ACTIVE)
                .build(),

            User.builder()
                .name("Sneha Verma")
                .email("sneha@hrdashboard.com")
                .password(passwordEncoder.encode("Welcome@123"))
                .role(User.Role.HR)
                .department("HR")
                .designation("HR Manager")
                .phone("+91 98765 43212")
                .manager("Admin User")
                .joinDate(LocalDate.of(2020, 1, 10))
                .status(User.Status.ACTIVE)
                .build(),

            User.builder()
                .name("Rahul Das")
                .email("rahul@hrdashboard.com")
                .password(passwordEncoder.encode("Welcome@123"))
                .role(User.Role.EMPLOYEE)
                .department("Engineering")
                .designation("Engineering Head")
                .phone("+91 98765 43213")
                .manager("Admin User")
                .joinDate(LocalDate.of(2019, 6, 20))
                .status(User.Status.ACTIVE)
                .build(),

            User.builder()
                .name("Priya Rajan")
                .email("priya@hrdashboard.com")
                .password(passwordEncoder.encode("Welcome@123"))
                .role(User.Role.EMPLOYEE)
                .department("Engineering")
                .designation("Senior Developer")
                .phone("+91 98765 43210")
                .manager("Rahul Das")
                .joinDate(LocalDate.of(2022, 3, 15))
                .status(User.Status.ACTIVE)
                .build(),

            User.builder()
                .name("Amit Kumar")
                .email("amit@hrdashboard.com")
                .password(passwordEncoder.encode("Welcome@123"))
                .role(User.Role.EMPLOYEE)
                .department("Design")
                .designation("UI/UX Designer")
                .phone("+91 98765 43211")
                .manager("Sneha Verma")
                .joinDate(LocalDate.of(2021, 7, 1))
                .status(User.Status.ACTIVE)
                .build(),

            User.builder()
                .name("Kiran Mehta")
                .email("kiran@hrdashboard.com")
                .password(passwordEncoder.encode("Welcome@123"))
                .role(User.Role.EMPLOYEE)
                .department("Finance")
                .designation("Finance Analyst")
                .phone("+91 98765 43214")
                .manager("Sneha Verma")
                .joinDate(LocalDate.of(2023, 2, 14))
                .status(User.Status.ACTIVE)
                .build()
        );

        userRepository.saveAll(users);
        log.info("Seeded {} users. Admin: admin@hrdashboard.com / Admin@123", users.size());
    }
}
