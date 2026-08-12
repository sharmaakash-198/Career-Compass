package com.authentication.AuthProject.features.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentRequestDto {

    @NotBlank(message = "Current role is required")
    private String currentRole;

    @NotBlank(message = "Target role is required")
    private String targetRole;
}
