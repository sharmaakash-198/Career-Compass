package com.authentication.AuthProject.features.auth.controller;

import com.authentication.AuthProject.features.auth.dto.LoginRequest;
import com.authentication.AuthProject.features.auth.dto.ResendOtpRequest;
import com.authentication.AuthProject.features.auth.dto.SignupRequest;
import com.authentication.AuthProject.features.auth.dto.VerifyOtpRequest;
import com.authentication.AuthProject.features.auth.dto.AuthResponse;
import com.authentication.AuthProject.features.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @GetMapping
    public String greet() {
        log.info("API healthcheck endpoint called");
        return "Authentication API is Running";
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request) {

        log.info("Received signup request for email: {}", request.getEmail());
        AuthResponse response = service.signup(request);
        log.info("Successfully registered user: {}", request.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        log.info("Received login request for email: {}", request.getEmail());
        AuthResponse response = service.login(request);
        log.info("User logged in successfully: {}", request.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        log.info("Received OTP verification request for email: {}", request.getEmail());
        AuthResponse response = service.verifyOtp(request);
        log.info("OTP verified successfully for email: {}", request.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(
            @Valid @RequestBody ResendOtpRequest request) {

        log.info("Received OTP resend request for email: {}", request.getEmail());
        AuthResponse response = service.resendOtp(request);
        log.info("OTP resent for email: {}", request.getEmail());

        return ResponseEntity.ok(response);
    }
}

