package com.authentication.AuthProject.features.assessment.service;

import com.authentication.AuthProject.features.ai.service.AIOrchestrator;
import com.authentication.AuthProject.features.assessment.dto.AssessmentResponseDto;
import com.authentication.AuthProject.features.assessment.entity.AssessmentJob;
import com.authentication.AuthProject.features.assessment.entity.AssessmentJobStatus;
import com.authentication.AuthProject.features.assessment.repository.AssessmentJobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentAsyncService {

    private final AssessmentJobRepository assessmentJobRepository;
    private final AIOrchestrator aiOrchestrator;

    @Async("assessmentTaskExecutor")
    @Transactional
    public void runJob(Long jobId, Long userId, String currentRole, String targetRole) {
        AssessmentJob job = assessmentJobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment job not found: " + jobId));

        job.setStatus(AssessmentJobStatus.RUNNING);
        job.setStep(2);
        job.setStepMessage("Evaluating target role skill gap & alignment score...");
        job.setUpdatedAt(Instant.now());
        assessmentJobRepository.save(job);

        try {
            AssessmentResponseDto response = aiOrchestrator.generateAssessment(userId, currentRole, targetRole);

            job.setStatus(AssessmentJobStatus.DONE);
            job.setStep(4);
            job.setStepMessage("Assessment generated successfully!");
            job.setAssessmentId(response.getAssessmentId());
            job.setErrorMessage(null);
            job.setCompletedAt(Instant.now());
            job.setUpdatedAt(Instant.now());
            assessmentJobRepository.save(job);
            log.info("Assessment job {} completed with assessmentId {}", jobId, response.getAssessmentId());
        } catch (Exception e) {
            log.error("Assessment job {} failed", jobId, e);
            job.setStatus(AssessmentJobStatus.FAILED);
            job.setErrorMessage(truncateError(e.getMessage()));
            job.setCompletedAt(Instant.now());
            job.setUpdatedAt(Instant.now());
            assessmentJobRepository.save(job);
        }
    }

    private String truncateError(String message) {
        if (message == null || message.isBlank()) {
            return "Assessment generation failed";
        }
        return message.length() > 480 ? message.substring(0, 480) : message;
    }
}
