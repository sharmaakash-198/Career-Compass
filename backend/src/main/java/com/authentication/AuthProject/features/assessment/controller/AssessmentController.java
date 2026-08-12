package com.authentication.AuthProject.features.assessment.controller;

import com.authentication.AuthProject.features.ai.service.AIOrchestrator;
import com.authentication.AuthProject.features.assessment.dto.AssessmentRequestDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentResponseDto;
import com.authentication.AuthProject.features.user.entity.User;
import com.authentication.AuthProject.features.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assessment")
@RequiredArgsConstructor
@Slf4j
public class AssessmentController {

    private final UserRepository userRepository;
    private final AIOrchestrator aiOrchestrator;

    @PostMapping
    public ResponseEntity<AssessmentResponseDto> createAssessment(@Valid @RequestBody AssessmentRequestDto request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Assessment creation requested by user: {}, targetRole: {}", email, request.getTargetRole());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        AssessmentResponseDto response = aiOrchestrator.generateAssessment(user.getId(), request.getCurrentRole(), request.getTargetRole());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/latest")
    public ResponseEntity<AssessmentResponseDto> getLatestAssessment() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Fetching latest assessment for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        AssessmentResponseDto response = aiOrchestrator.getLatestAssessment(user.getId());
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }
}
