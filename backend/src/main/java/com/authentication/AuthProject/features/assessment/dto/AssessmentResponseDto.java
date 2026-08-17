package com.authentication.AuthProject.features.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentResponseDto {

    private Long assessmentId;
    private String currentRole;
    private String targetRole;
    private int marketFitScore;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<SkillGapDto> missingSkills;
    private List<RoadmapItemDto> roadmap;
    private List<RecommendedProjectDto> projects;
    private List<LearningResourceDto> resources;
    private String careerAdvice;
    private String summary;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGapDto {
        private String name;
        private String priority;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapItemDto {
        private String month;
        private List<String> topics;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendedProjectDto {
        private String name;
        private List<String> skillsLearned;
        private String duration;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningResourceDto {
        private String name;
        private String difficulty;
        private String duration;
        private String link;
    }
}
