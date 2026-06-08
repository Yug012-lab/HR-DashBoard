package com.hrdashboard.service;

import com.hrdashboard.model.User;
import com.hrdashboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllEmployees() {
        return userRepository.findAll();
    }

    public User getEmployee(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public User createEmployee(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        // Default password: Welcome@123 (employee must change on first login)
        user.setPassword(passwordEncoder.encode("Welcome@123"));
        if (user.getRole() == null) user.setRole(User.Role.EMPLOYEE);
        return userRepository.save(user);
    }

    public User updateEmployee(Long id, User updated) {
        User existing = getEmployee(id);
        existing.setName(updated.getName());
        existing.setDepartment(updated.getDepartment());
        existing.setDesignation(updated.getDesignation());
        existing.setPhone(updated.getPhone());
        existing.setManager(updated.getManager());
        existing.setStatus(updated.getStatus() != null ? updated.getStatus() : existing.getStatus());
        return userRepository.save(existing);
    }

    public void deleteEmployee(Long id) {
        User user = getEmployee(id);
        user.setStatus(User.Status.INACTIVE);
        userRepository.save(user); // Soft delete
    }
}
