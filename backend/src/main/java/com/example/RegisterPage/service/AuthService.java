package com.example.RegisterPage.service;

import com.example.RegisterPage.dto.LoginRequest;
import com.example.RegisterPage.dto.RegisterRequest;
import com.example.RegisterPage.entity.User;
import com.example.RegisterPage.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already registered";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        return "Registration successful";
    }

    public String login(LoginRequest request) {

        User existingUser =
                userRepository
                        .findByEmail(request.getEmail())
                        .orElse(null);

        if (existingUser == null) {
            return "User not found";
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                existingUser.getPassword())) {

            return "Invalid password";
        }

        return "Login successful";
    }

    public User getUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
    }
}