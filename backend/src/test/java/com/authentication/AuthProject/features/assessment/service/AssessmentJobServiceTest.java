package com.authentication.AuthProject.features.assessment.service;

import com.authentication.AuthProject.core.exception.ResourceNotFoundException;
import com.authentication.AuthProject.features.assessment.repository.AssessmentJobRepository;
import com.authentication.AuthProject.features.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssessmentJobServiceTest {

    @InjectMocks
    private AssessmentJobService assessmentJobService;

    @Mock
    private AssessmentJobRepository assessmentJobRepository;

    @Mock
    private AssessmentAsyncService assessmentAsyncService;

    @Mock
    private com.authentication.AuthProject.features.ai.service.AIOrchestrator aiOrchestrator;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("test@example.com").build();
    }

    @Test
    void getJobStatus_throwsWhenJobMissing() {
        when(assessmentJobRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> assessmentJobService.getJobStatus(user, 99L));
    }
}
