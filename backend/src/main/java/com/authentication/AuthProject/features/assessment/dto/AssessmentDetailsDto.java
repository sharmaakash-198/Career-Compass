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
public class AssessmentDetailsDto {

    private List<AssessmentResponseDto.RoadmapItemDto> roadmap;
    private List<AssessmentResponseDto.RecommendedProjectDto> projects;
    private List<AssessmentResponseDto.LearningResourceDto> resources;
}
