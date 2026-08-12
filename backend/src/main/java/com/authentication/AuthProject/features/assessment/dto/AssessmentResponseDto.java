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

    private int marketFitScore;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<SkillGapDto> missingSkills;
    private List<RoadmapItemDto> roadmap;
    private List<RecommendedProjectDto> projects;
    private List<LearningResourceDto> resources;
    private List<InterviewPlanDto> interviewPreparation;
    private String careerAdvice;
    private String summary;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGapDto {
        private String name;
        private String priority; // "High", "Medium", "Low"
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
        private String difficulty; // "Beginner", "Intermediate", "Advanced"
        private String duration;
        private String link;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewPlanDto {
        private String phaseLabel;
        private List<String> topics;
        private List<String> sampleQuestions;
    }
}
