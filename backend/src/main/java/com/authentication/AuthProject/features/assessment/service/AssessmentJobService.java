package com.authentication.AuthProject.features.assessment.service;

import com.authentication.AuthProject.core.exception.ResourceNotFoundException;
import com.authentication.AuthProject.features.ai.service.AIOrchestrator;
import com.authentication.AuthProject.features.assessment.dto.AssessmentJobCreatedDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentJobStatusDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentRequestDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentResponseDto;
import com.authentication.AuthProject.features.assessment.entity.AssessmentJob;
import com.authentication.AuthProject.features.assessment.entity.AssessmentJobStatus;
import com.authentication.AuthProject.features.assessment.repository.AssessmentJobRepository;
import com.authentication.AuthProject.features.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AssessmentJobService {

    private final AssessmentJobRepository assessmentJobRepository;
    private final AssessmentAsyncService assessmentAsyncService;
    private final AIOrchestrator aiOrchestrator;

    @Transactional
    public AssessmentJobCreatedDto createJob(User user, AssessmentRequestDto request) {
        Instant now = Instant.now();
        AssessmentJob job = AssessmentJob.builder()
                .user(user)
                .currentRole(request.getCurrentRole())
                .targetRole(request.getTargetRole())
                .status(AssessmentJobStatus.QUEUED)
                .step(1)
                .stepMessage("Queued: Extracting profile skills and preferences...")
                .createdAt(now)
                .updatedAt(now)
                .build();
        job = assessmentJobRepository.save(job);

        Long jobId = job.getId();
        String currentRole = job.getCurrentRole();
        String targetRole = job.getTargetRole();
        Long userId = user.getId();
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                assessmentAsyncService.runJob(jobId, userId, currentRole, targetRole);
            }
        });

        return AssessmentJobCreatedDto.builder().jobId(jobId).build();
    }

    @Transactional(readOnly = true)
    public AssessmentJobStatusDto getJobStatus(User user, Long jobId) {
        AssessmentJob job = assessmentJobRepository.findByIdAndUserId(jobId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment job not found."));

        AssessmentResponseDto result = null;
        if (job.getStatus() == AssessmentJobStatus.DONE && job.getAssessmentId() != null) {
            result = aiOrchestrator.getAssessmentById(user.getId(), job.getAssessmentId());
        }

        return AssessmentJobStatusDto.builder()
                .jobId(job.getId())
                .status(job.getStatus())
                .step(job.getStep())
                .stepMessage(job.getStepMessage())
                .errorMessage(job.getErrorMessage())
                .result(result)
                .build();
    }
}
