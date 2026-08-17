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
public class AssessmentSummaryDto {

    private Long assessmentId;
    private String currentRole;
    private String targetRole;
    private int marketFitScore;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<AssessmentResponseDto.SkillGapDto> missingSkills;
    private String summary;
    private String careerAdvice;
}
