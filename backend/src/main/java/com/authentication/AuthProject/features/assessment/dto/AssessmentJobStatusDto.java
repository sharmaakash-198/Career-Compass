package com.authentication.AuthProject.features.assessment.dto;

import com.authentication.AuthProject.features.assessment.entity.AssessmentJobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentJobStatusDto {
    private Long jobId;
    private AssessmentJobStatus status;
    private Integer step;
    private String stepMessage;
    private String errorMessage;
    private AssessmentResponseDto result;
}
