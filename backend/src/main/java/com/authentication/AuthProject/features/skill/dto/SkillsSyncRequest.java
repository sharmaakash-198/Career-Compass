package com.authentication.AuthProject.features.skill.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillsSyncRequest {

    @NotNull(message = "Skills list is required")
    private List<@NotBlank @Size(max = 100) String> skills;
}
