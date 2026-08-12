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
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIOrchestrator {

    private final NvidiaClient nvidiaClient;
    private final PromptBuilder promptBuilder;
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserResumeRepository userResumeRepository;
    private final ResourceRepository resourceRepository;
    private final AssessmentRepository assessmentRepository;
    private final RoadmapMilestoneRepository roadmapMilestoneRepository;
    private final RecommendedProjectRepository recommendedProjectRepository;
    private final InterviewPlanRepository interviewPlanRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public AssessmentResponseDto generateAssessment(Long userId, String currentRole, String targetRole) {
        log.info("Generating AI career assessment for userId: {}, currentRole: {}, targetRole: {}", userId, currentRole, targetRole);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // 1. Fetch user's current skills
        List<String> currentSkills = userSkillRepository.findByUserId(userId).stream()
                .map(UserSkill::getSkillName)
                .collect(Collectors.toList());

        // 2. Fetch user's latest resume text
        List<UserResume> resumes = userResumeRepository.findByUserId(userId);
        String resumeText = resumes.isEmpty() ? "" : resumes.get(resumes.size() - 1).getRawText();

        // 3. Fetch available knowledge base resources
        List<Resource> dbResources = resourceRepository.findAll();

        // 4. Build prompt
        String systemPrompt = promptBuilder.buildSystemPrompt();
        String userPrompt = promptBuilder.buildUserPrompt(currentRole, currentSkills, targetRole, dbResources);

        // 5. Call NVIDIA API
        String rawResponse = nvidiaClient.callInference(systemPrompt, userPrompt);
        String cleanJson = cleanJsonString(rawResponse);

        log.debug("Cleaned JSON from NVIDIA NIM API: {}", cleanJson);

        // 6. Parse JSON into Pojo
        AiResponsePojo responsePojo;
        try {
            responsePojo = objectMapper.readValue(cleanJson, AiResponsePojo.class);
        } catch (Exception e) {
            log.error("Failed to parse JSON response from NVIDIA NIM API: {}", cleanJson, e);
            throw new RuntimeException("Error parsing AI assessment output: " + e.getMessage(), e);
        }

        // 7. Persist to Database
        Assessment assessment = new Assessment();
        assessment.setUser(user);
        assessment.setCurrentRole(currentRole);
        assessment.setTargetRole(targetRole);
        assessment.setScore(responsePojo.getScore());
        assessment.setStrengths(responsePojo.getStrengths() != null ? responsePojo.getStrengths() : Collections.emptyList());
        assessment.setWeaknesses(responsePojo.getWeaknesses() != null ? responsePojo.getWeaknesses() : Collections.emptyList());
        assessment.setMissingSkills(responsePojo.getMissingSkills() != null ? responsePojo.getMissingSkills() : Collections.emptyList());
        assessment.setSummary(responsePojo.getSummary());
        assessment.setCareerAdvice(responsePojo.getCareerAdvice());
        assessment.setCreatedAt(Instant.now());
        assessment = assessmentRepository.save(assessment);

        final Assessment savedAssessment = assessment;

        List<RoadmapMilestone> milestones = new ArrayList<>();
        if (responsePojo.getRoadmap() != null) {
            for (RoadmapMilestonePojo rp : responsePojo.getRoadmap()) {
                RoadmapMilestone rm = new RoadmapMilestone();
                rm.setAssessment(savedAssessment);
                rm.setMonthLabel(rp.getMonthLabel());
                rm.setTopicName(rp.getTopicName());
                rm.setDescription(rp.getDescription());
                rm.setIsCompleted(false);
                milestones.add(roadmapMilestoneRepository.save(rm));
            }
        }

        List<RecommendedProject> projects = new ArrayList<>();
        if (responsePojo.getRecommendedProjects() != null) {
            for (RecommendedProjectPojo pp : responsePojo.getRecommendedProjects()) {
                RecommendedProject rp = new RecommendedProject();
                rp.setAssessment(savedAssessment);
                rp.setTitle(pp.getTitle());
                rp.setDescription(pp.getDescription());
                rp.setDifficulty(pp.getDifficulty());
                rp.setDuration(pp.getDuration());
                rp.setIsCompleted(false);
                projects.add(recommendedProjectRepository.save(rp));
            }
        }

        List<InterviewPlan> interviewPlans = new ArrayList<>();
        if (responsePojo.getInterviewPreparation() != null) {
            for (InterviewPlanPojo ip : responsePojo.getInterviewPreparation()) {
                InterviewPlan plan = new InterviewPlan();
                plan.setAssessment(savedAssessment);
                plan.setPhaseLabel(ip.getPhaseLabel());
                plan.setTopics(ip.getTopics() != null ? ip.getTopics() : Collections.emptyList());
                plan.setSampleQuestions(ip.getSampleQuestions() != null ? ip.getSampleQuestions() : Collections.emptyList());
                interviewPlans.add(interviewPlanRepository.save(plan));
            }
        }

        // 8. Build and return response DTO matching React frontend expectations
        return buildResponseDto(savedAssessment, milestones, projects, dbResources, interviewPlans);
    }

    @Transactional(readOnly = true)
    public AssessmentResponseDto getLatestAssessment(Long userId) {
        List<Assessment> assessments = assessmentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (assessments.isEmpty()) {
            return null;
        }
        Assessment assessment = assessments.get(0);
        List<RoadmapMilestone> milestones = roadmapMilestoneRepository.findByAssessmentIdOrderByMonthLabelAsc(assessment.getId());
        List<RecommendedProject> projects = recommendedProjectRepository.findByAssessmentId(assessment.getId());
        List<InterviewPlan> interviewPlans = interviewPlanRepository.findByAssessmentId(assessment.getId());
        List<Resource> dbResources = resourceRepository.findAll();

        return buildResponseDto(assessment, milestones, projects, dbResources, interviewPlans);
    }

    private AssessmentResponseDto buildResponseDto(Assessment assessment,
                                                   List<RoadmapMilestone> milestones,
                                                   List<RecommendedProject> projects,
                                                   List<Resource> dbResources,
                                                   List<InterviewPlan> interviewPlans) {
        
        // Map missing skills with dynamic priority
        List<AssessmentResponseDto.SkillGapDto> missingSkillsDto = new ArrayList<>();
        List<String> missing = assessment.getMissingSkills();
        for (int i = 0; i < missing.size(); i++) {
            String priority = "Low";
            if (i < 3) {
                priority = "High";
            } else if (i < 7) {
                priority = "Medium";
            }
            missingSkillsDto.add(AssessmentResponseDto.SkillGapDto.builder()
                    .name(missing.get(i))
                    .priority(priority)
                    .build());
        }

        // Map roadmap milestones to monthly roadmap items
        // Grouping by Month Label (e.g. Month 1 -> List of topics)
        List<AssessmentResponseDto.RoadmapItemDto> roadmapDto = milestones.stream()
                .collect(Collectors.groupingBy(RoadmapMilestone::getMonthLabel))
                .entrySet().stream()
                .map(entry -> AssessmentResponseDto.RoadmapItemDto.builder()
                        .month(entry.getKey())
                        .topics(entry.getValue().stream().map(rm -> {
                            if (rm.getDescription() != null && !rm.getDescription().isBlank() && !"null".equalsIgnoreCase(rm.getDescription())) {
                                return rm.getTopicName() + ": " + rm.getDescription();
                            }
                            return rm.getTopicName();
                        }).collect(Collectors.toList()))
                        .build())
                .sorted((a, b) -> a.getMonth().compareToIgnoreCase(b.getMonth()))
                .collect(Collectors.toList());

        // Map projects
        List<AssessmentResponseDto.RecommendedProjectDto> projectsDto = projects.stream()
                .map(p -> AssessmentResponseDto.RecommendedProjectDto.builder()
                        .name(p.getTitle())
                        .duration(p.getDuration())
                        .skillsLearned(List.of(p.getDifficulty() + " level project"))
                        .build())
                .collect(Collectors.toList());

        // Map recommended resources from DB matching missing skills
        List<AssessmentResponseDto.LearningResourceDto> resourcesDto = new ArrayList<>();
        List<String> normalizedMissing = missing.stream().map(String::toLowerCase).collect(Collectors.toList());
        
        List<Resource> matchedResources = dbResources.stream()
                .filter(res -> res.getSkills().stream().anyMatch(skill -> normalizedMissing.contains(skill.toLowerCase())))
                .collect(Collectors.toList());

        // Fallback to top resources if no specific skill matches
        if (matchedResources.isEmpty() && !dbResources.isEmpty()) {
            matchedResources = dbResources.stream().limit(3).collect(Collectors.toList());
        }

        for (Resource r : matchedResources) {
            String diff = "Intermediate";
            if ("BEGINNER".equalsIgnoreCase(r.getDifficulty())) diff = "Beginner";
            if ("ADVANCED".equalsIgnoreCase(r.getDifficulty())) diff = "Advanced";

            resourcesDto.add(AssessmentResponseDto.LearningResourceDto.builder()
                    .name(r.getTitle())
                    .difficulty(diff)
                    .duration(r.getEstimatedLearningTime() != null ? r.getEstimatedLearningTime() : "Self-paced")
                    .link(r.getUrl())
                    .build());
        }

        // Map interview preparation phase
        List<AssessmentResponseDto.InterviewPlanDto> interviewDto = interviewPlans.stream()
                .map(ip -> AssessmentResponseDto.InterviewPlanDto.builder()
                        .phaseLabel(ip.getPhaseLabel())
                        .topics(ip.getTopics())
                        .sampleQuestions(ip.getSampleQuestions())
                        .build())
                .collect(Collectors.toList());

        return AssessmentResponseDto.builder()
                .marketFitScore(assessment.getScore())
                .strengths(assessment.getStrengths())
                .weaknesses(assessment.getWeaknesses())
                .missingSkills(missingSkillsDto)
                .roadmap(roadmapDto)
                .projects(projectsDto)
                .resources(resourcesDto)
                .interviewPreparation(interviewDto)
                .careerAdvice(assessment.getCareerAdvice())
                .summary(assessment.getSummary())
                .build();
    }

    private String cleanJsonString(String response) {
        if (response == null) return "{}";
        response = response.trim();
        if (response.startsWith("```json")) {
            response = response.substring(7);
        } else if (response.startsWith("```")) {
            response = response.substring(3);
        }
        if (response.endsWith("```")) {
            response = response.substring(0, response.length() - 3);
        }
        return response.trim();
    }

    // Inner classes for Jackson parsing
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AiResponsePojo {
        private int score;
        private List<String> strengths;
        private List<String> weaknesses;
        private List<String> missingSkills;
        private List<RoadmapMilestonePojo> roadmap;
        private List<RecommendedProjectPojo> recommendedProjects;
        private List<InterviewPlanPojo> interviewPreparation;
        private String careerAdvice;
        private String summary;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RoadmapMilestonePojo {
        private String monthLabel;
        private String topicName;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RecommendedProjectPojo {
        private String title;
        private String description;
        private String difficulty;
        private String duration;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InterviewPlanPojo {
        private String phaseLabel;
        private List<String> topics;
        private List<String> sampleQuestions;
    }
}
