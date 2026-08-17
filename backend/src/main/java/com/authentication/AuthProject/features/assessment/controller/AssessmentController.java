package com.authentication.AuthProject.features.assessment.controller;

import com.authentication.AuthProject.features.ai.service.AIOrchestrator;
import com.authentication.AuthProject.features.assessment.dto.AssessmentDetailsDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentJobCreatedDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentJobStatusDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentRequestDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentResponseDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentSummaryDto;
import com.authentication.AuthProject.features.assessment.service.AssessmentJobService;
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
    private final AssessmentJobService assessmentJobService;

    @PostMapping("/jobs")
    public ResponseEntity<AssessmentJobCreatedDto> createAssessmentJob(@Valid @RequestBody AssessmentRequestDto request) {
        User user = currentUser();
        log.info("Async assessment job requested by user: {}, targetRole: {}", user.getEmail(), request.getTargetRole());
        AssessmentJobCreatedDto response = assessmentJobService.createJob(user, request);
        return ResponseEntity.accepted().body(response);
    }

    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<AssessmentJobStatusDto> getAssessmentJob(@PathVariable Long jobId) {
        User user = currentUser();
        log.info("Fetching assessment job {} for user: {}", jobId, user.getEmail());
        return ResponseEntity.ok(assessmentJobService.getJobStatus(user, jobId));
    }

    @PostMapping
    public ResponseEntity<AssessmentResponseDto> createAssessment(@Valid @RequestBody AssessmentRequestDto request) {
        User user = currentUser();
        log.info("Assessment creation requested by user: {}, targetRole: {}", user.getEmail(), request.getTargetRole());

        AssessmentResponseDto response = aiOrchestrator.generateAssessment(user.getId(), request.getCurrentRole(), request.getTargetRole());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/latest")
    public ResponseEntity<AssessmentResponseDto> getLatestAssessment() {
        User user = currentUser();
        log.info("Fetching latest assessment for user: {}", user.getEmail());

        AssessmentResponseDto response = aiOrchestrator.getLatestAssessment(user.getId());
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/latest/summary")
    public ResponseEntity<AssessmentSummaryDto> getLatestSummary() {
        User user = currentUser();
        log.info("Fetching latest assessment summary for user: {}", user.getEmail());

        AssessmentSummaryDto response = aiOrchestrator.getLatestSummary(user.getId());
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/latest/details")
    public ResponseEntity<AssessmentDetailsDto> getLatestDetails() {
        User user = currentUser();
        log.info("Fetching latest assessment details for user: {}", user.getEmail());

        AssessmentDetailsDto response = aiOrchestrator.getLatestDetails(user.getId());
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }
}
