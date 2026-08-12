package com.authentication.AuthProject.features.resource.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceDto {
    private Long id;
    private String title;
    private String description;
    private String url;
    private String source;
    private String category;
    private String difficulty;
    private String estimatedLearningTime;
    private Set<String> skills;
    private Set<String> tags;
}
