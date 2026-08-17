package com.authentication.AuthProject.features.ai.service;

import com.authentication.AuthProject.features.ai.client.NvidiaClient;
import com.authentication.AuthProject.features.ai.prompt.PromptBuilder;
import com.authentication.AuthProject.features.assessment.dto.AssessmentDetailsDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentResponseDto;
import com.authentication.AuthProject.features.assessment.dto.AssessmentSummaryDto;
import com.authentication.AuthProject.features.assessment.entity.Assessment;
import com.authentication.AuthProject.features.assessment.repository.AssessmentRepository;
import com.authentication.AuthProject.features.user.entity.User;
import com.authentication.AuthProject.features.project.entity.RecommendedProject;
import com.authentication.AuthProject.features.project.repository.RecommendedProjectRepository;
import com.authentication.AuthProject.features.user.repository.UserRepository;
import com.authentication.AuthProject.features.resource.entity.Resource;
import com.authentication.AuthProject.features.resource.repository.ResourceRepository;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIOrchestrator {

    private final NvidiaClient nvidiaClient;
    private final PromptBuilder promptBuilder;
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final ResourceRepository resourceRepository;
    private final AssessmentRepository assessmentRepository;
    private final RoadmapMilestoneRepository roadmapMilestoneRepository;
    private final RecommendedProjectRepository recommendedProjectRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public AssessmentResponseDto generateAssessment(Long userId, String currentRole, String targetRole) {
        log.info("Generating AI career assessment for userId: {}, currentRole: {}, targetRole: {}", userId, currentRole, targetRole);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        List<String> currentSkills = userSkillRepository.findByUserId(userId).stream()
                .map(UserSkill::getSkillName)
                .collect(Collectors.toList());

        String systemPrompt = promptBuilder.buildSystemPrompt();
        String userPrompt = promptBuilder.buildUserPrompt(currentRole, currentSkills, targetRole);

        String rawResponse = nvidiaClient.callInference(systemPrompt, userPrompt);
        String cleanJson = cleanJsonString(rawResponse);

        log.debug("Cleaned JSON from NVIDIA NIM API: {}", cleanJson);

        AiResponsePojo responsePojo;
        try {
            responsePojo = objectMapper.readValue(cleanJson, AiResponsePojo.class);
        } catch (Exception e) {
            log.error("Failed to parse JSON response from NVIDIA NIM API: {}", cleanJson, e);
            throw new RuntimeException("Error parsing AI assessment output: " + e.getMessage(), e);
        }

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
                milestones.add(rm);
            }
        }
        milestones = roadmapMilestoneRepository.saveAll(milestones);

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
                projects.add(rp);
            }
        }
        projects = recommendedProjectRepository.saveAll(projects);

        return mergeResponse(buildSummaryDto(savedAssessment), buildDetailsDto(savedAssessment, milestones, projects));
    }

    @Transactional(readOnly = true)
    public AssessmentResponseDto getLatestAssessment(Long userId) {
        AssessmentSummaryDto summary = getLatestSummary(userId);
        if (summary == null) {
            return null;
        }
        AssessmentDetailsDto details = getLatestDetails(userId);
        if (details == null) {
            details = AssessmentDetailsDto.builder()
                    .roadmap(Collections.emptyList())
                    .projects(Collections.emptyList())
                    .resources(Collections.emptyList())
                    .build();
        }
        return mergeResponse(summary, details);
    }

    @Transactional(readOnly = true)
    public AssessmentSummaryDto getLatestSummary(Long userId) {
        return findLatestAssessment(userId).map(this::buildSummaryDto).orElse(null);
    }

    @Transactional(readOnly = true)
    public AssessmentDetailsDto getLatestDetails(Long userId) {
        Optional<Assessment> assessmentOpt = findLatestAssessment(userId);
        if (assessmentOpt.isEmpty()) {
            return null;
        }
        Assessment assessment = assessmentOpt.get();
        List<RoadmapMilestone> milestones = roadmapMilestoneRepository.findByAssessmentIdOrderByMonthLabelAsc(assessment.getId());
        List<RecommendedProject> projects = recommendedProjectRepository.findByAssessmentId(assessment.getId());
        return buildDetailsDto(assessment, milestones, projects);
    }

    @Transactional(readOnly = true)
    public AssessmentResponseDto getAssessmentById(Long userId, Long assessmentId) {
        Assessment assessment = assessmentRepository.findByIdAndUserId(assessmentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found: " + assessmentId));
        List<RoadmapMilestone> milestones = roadmapMilestoneRepository.findByAssessmentIdOrderByMonthLabelAsc(assessment.getId());
        List<RecommendedProject> projects = recommendedProjectRepository.findByAssessmentId(assessment.getId());
        return mergeResponse(buildSummaryDto(assessment), buildDetailsDto(assessment, milestones, projects));
    }

    private Optional<Assessment> findLatestAssessment(Long userId) {
        List<Assessment> assessments = assessmentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (assessments.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(assessments.get(0));
    }

    private AssessmentSummaryDto buildSummaryDto(Assessment assessment) {
        return AssessmentSummaryDto.builder()
                .assessmentId(assessment.getId())
                .currentRole(assessment.getCurrentRole())
                .targetRole(assessment.getTargetRole())
                .marketFitScore(assessment.getScore())
                .strengths(assessment.getStrengths())
                .weaknesses(assessment.getWeaknesses())
                .missingSkills(buildMissingSkillsDto(assessment.getMissingSkills()))
                .summary(assessment.getSummary())
                .careerAdvice(assessment.getCareerAdvice())
                .build();
    }

    private AssessmentDetailsDto buildDetailsDto(Assessment assessment,
                                                   List<RoadmapMilestone> milestones,
                                                   List<RecommendedProject> projects) {
        return AssessmentDetailsDto.builder()
                .roadmap(buildRoadmapDto(milestones))
                .projects(buildProjectsDto(projects))
                .resources(buildResourcesDto(assessment))
                .build();
    }

    private AssessmentResponseDto mergeResponse(AssessmentSummaryDto summary, AssessmentDetailsDto details) {
        return AssessmentResponseDto.builder()
                .assessmentId(summary.getAssessmentId())
                .currentRole(summary.getCurrentRole())
                .targetRole(summary.getTargetRole())
                .marketFitScore(summary.getMarketFitScore())
                .strengths(summary.getStrengths())
                .weaknesses(summary.getWeaknesses())
                .missingSkills(summary.getMissingSkills())
                .summary(summary.getSummary())
                .careerAdvice(summary.getCareerAdvice())
                .roadmap(details.getRoadmap())
                .projects(details.getProjects())
                .resources(details.getResources())
                .build();
    }

    private List<AssessmentResponseDto.SkillGapDto> buildMissingSkillsDto(List<String> missing) {
        List<AssessmentResponseDto.SkillGapDto> missingSkillsDto = new ArrayList<>();
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
        return missingSkillsDto;
    }

    private List<AssessmentResponseDto.RoadmapItemDto> buildRoadmapDto(List<RoadmapMilestone> milestones) {
        return milestones.stream()
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
    }

    private List<AssessmentResponseDto.RecommendedProjectDto> buildProjectsDto(List<RecommendedProject> projects) {
        return projects.stream()
                .map(p -> AssessmentResponseDto.RecommendedProjectDto.builder()
                        .name(p.getTitle())
                        .duration(p.getDuration())
                        .skillsLearned(List.of(p.getDifficulty() + " level project"))
                        .build())
                .collect(Collectors.toList());
    }

    private List<AssessmentResponseDto.LearningResourceDto> buildResourcesDto(Assessment assessment) {
        List<AssessmentResponseDto.LearningResourceDto> resourcesDto = new ArrayList<>();
        List<String> missing = assessment.getMissingSkills();
        List<String> normalizedMissing = missing.stream().map(String::toLowerCase).collect(Collectors.toList());
        String targetRole = assessment.getTargetRole() != null ? assessment.getTargetRole().toLowerCase() : "";
        List<Resource> resourceCandidates = loadResourceCandidates(assessment);

        List<Resource> matchedResources = resourceCandidates.stream()
                .filter(res -> resourceMatchesProfile(res, normalizedMissing, targetRole))
                .limit(5)
                .collect(Collectors.toList());

        if (matchedResources.isEmpty()) {
            matchedResources = resourceCandidates.stream().limit(5).collect(Collectors.toList());
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
        return resourcesDto;
    }

    private List<Resource> loadResourceCandidates(Assessment assessment) {
        LinkedHashMap<Long, Resource> matched = new LinkedHashMap<>();
        for (String skill : assessment.getMissingSkills()) {
            for (Resource resource : resourceRepository.findBySkill(skill)) {
                matched.put(resource.getId(), resource);
            }
        }

        if (!matched.isEmpty()) {
            return new ArrayList<>(matched.values());
        }

        List<Resource> all = resourceRepository.findAll();
        if (all.isEmpty()) {
            return all;
        }

        int offset = (int) (assessment.getId() % all.size());
        List<Resource> fallback = new ArrayList<>();
        for (int i = 0; i < Math.min(5, all.size()); i++) {
            fallback.add(all.get((offset + i) % all.size()));
        }
        return fallback;
    }

    private boolean resourceMatchesProfile(Resource resource, List<String> normalizedMissing, String targetRole) {
        for (String skill : resource.getSkills()) {
            String normalizedSkill = skill.toLowerCase();
            for (String missing : normalizedMissing) {
                if (normalizedSkill.equals(missing)
                        || normalizedSkill.contains(missing)
                        || missing.contains(normalizedSkill)) {
                    return true;
                }
            }
        }

        if (targetRole.isBlank()) {
            return false;
        }

        String roleToken = targetRole.replace('-', ' ');
        if (resource.getCategory() != null && resource.getCategory().toLowerCase().contains(roleToken)) {
            return true;
        }
        if (resource.getTitle() != null && resource.getTitle().toLowerCase().contains(roleToken)) {
            return true;
        }
        return resource.getTags().stream().anyMatch(tag -> {
            String normalizedTag = tag.toLowerCase();
            return normalizedTag.contains(roleToken) || roleToken.contains(normalizedTag);
        });
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
}
