package com.authentication.AuthProject.features.ai.service;

import com.authentication.AuthProject.features.ai.client.NvidiaClient;
import com.authentication.AuthProject.features.ai.prompt.PromptBuilder;
import com.authentication.AuthProject.features.assessment.dto.AssessmentResponseDto;
import com.authentication.AuthProject.features.assessment.entity.Assessment;
import com.authentication.AuthProject.features.assessment.repository.AssessmentRepository;
import com.authentication.AuthProject.features.user.entity.User;
import com.authentication.AuthProject.features.interview.entity.InterviewPlan;
import com.authentication.AuthProject.features.interview.repository.InterviewPlanRepository;
import com.authentication.AuthProject.features.project.entity.RecommendedProject;
import com.authentication.AuthProject.features.project.repository.RecommendedProjectRepository;
import com.authentication.AuthProject.features.user.repository.UserRepository;
import com.authentication.AuthProject.features.resource.entity.Resource;
import com.authentication.AuthProject.features.resource.repository.ResourceRepository;
import com.authentication.AuthProject.features.resume.entity.UserResume;
import com.authentication.AuthProject.features.resume.repository.UserResumeRepository;
import com.authentication.AuthProject.features.roadmap.entity.RoadmapMilestone;
import com.authentication.AuthProject.features.roadmap.repository.RoadmapMilestoneRepository;
import com.authentication.AuthProject.features.skill.entity.UserSkill;
import com.authentication.AuthProject.features.skill.repository.UserSkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AIOrchestratorTest {

    @Mock
    private NvidiaClient nvidiaClient;

    @Mock
    private PromptBuilder promptBuilder;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserSkillRepository userSkillRepository;

    @Mock
    private UserResumeRepository userResumeRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private AssessmentRepository assessmentRepository;

    @Mock
    private RoadmapMilestoneRepository roadmapMilestoneRepository;

    @Mock
    private RecommendedProjectRepository recommendedProjectRepository;

    @Mock
    private InterviewPlanRepository interviewPlanRepository;

    @InjectMocks
    private AIOrchestrator aiOrchestrator;

    private User sampleUser;
    private String rawJsonResponse;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("test@example.com");

        rawJsonResponse = "{\n" +
                "  \"score\": 80,\n" +
                "  \"strengths\": [\"Java basics\"],\n" +
                "  \"weaknesses\": [\"No Docker\"],\n" +
                "  \"missingSkills\": [\"Docker\"],\n" +
                "  \"roadmap\": [\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 1\",\n" +
                "      \"topicName\": \"Docker Containers\",\n" +
                "      \"description\": \"Dockerfile build optimization\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"recommendedProjects\": [\n" +
                "    {\n" +
                "      \"title\": \"API Dockerization\",\n" +
                "      \"description\": \"Dockerize application\",\n" +
                "      \"difficulty\": \"Intermediate\",\n" +
                "      \"duration\": \"1 week\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"interviewPreparation\": [\n" +
                "    {\n" +
                "      \"phaseLabel\": \"Foundations\",\n" +
                "      \"topics\": [\"Containerization\"],\n" +
                "      \"sampleQuestions\": [\"What is Docker?\"]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"careerAdvice\": \"Learn devops\",\n" +
                "  \"summary\": \"Solid foundation\"\n" +
                "}";
    }

    @Test
    void testGenerateAssessment_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userSkillRepository.findByUserId(1L)).thenReturn(Collections.emptyList());
        when(userResumeRepository.findByUserId(1L)).thenReturn(Collections.emptyList());
        when(resourceRepository.findAll()).thenReturn(Collections.emptyList());
        when(promptBuilder.buildSystemPrompt()).thenReturn("system-prompt");
        when(promptBuilder.buildUserPrompt(any(), any(), any(), any())).thenReturn("user-prompt");
        when(nvidiaClient.callInference("system-prompt", "user-prompt")).thenReturn(rawJsonResponse);

        when(assessmentRepository.save(any(Assessment.class))).thenAnswer(inv -> {
            Assessment a = inv.getArgument(0);
            a.setId(10L);
            return a;
        });
        when(roadmapMilestoneRepository.save(any(RoadmapMilestone.class))).thenAnswer(inv -> inv.getArgument(0));
        when(recommendedProjectRepository.save(any(RecommendedProject.class))).thenAnswer(inv -> inv.getArgument(0));
        when(interviewPlanRepository.save(any(InterviewPlan.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        AssessmentResponseDto response = aiOrchestrator.generateAssessment(1L, "Junior", "Mid Backend");

        // Assert
        assertNotNull(response);
        assertEquals(80, response.getMarketFitScore());
        assertEquals("Solid foundation", response.getSummary());
        assertEquals("Learn devops", response.getCareerAdvice());
        assertEquals(1, response.getMissingSkills().size());
        assertEquals("Docker", response.getMissingSkills().get(0).getName());
        assertEquals(1, response.getRoadmap().size());
        assertEquals("Month 1", response.getRoadmap().get(0).getMonth());

        verify(assessmentRepository, times(1)).save(any(Assessment.class));
        verify(roadmapMilestoneRepository, times(1)).save(any(RoadmapMilestone.class));
        verify(recommendedProjectRepository, times(1)).save(any(RecommendedProject.class));
        verify(interviewPlanRepository, times(1)).save(any(InterviewPlan.class));
    }

    @Test
    void testGetLatestAssessment_Empty() {
        // Arrange
        when(assessmentRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(Collections.emptyList());

        // Act
        AssessmentResponseDto response = aiOrchestrator.getLatestAssessment(1L);

        // Assert
        assertNull(response);
    }
}
