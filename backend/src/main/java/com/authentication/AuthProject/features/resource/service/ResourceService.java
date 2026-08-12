package com.authentication.AuthProject.features.resource.service;

import com.authentication.AuthProject.features.resource.dto.ResourceDto;
import com.authentication.AuthProject.features.resource.entity.Resource;
import com.authentication.AuthProject.features.resource.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResourceService {

    private final ResourceRepository resourceRepository;

    @Transactional(readOnly = true)
    public List<ResourceDto> getAllResources() {
        log.info("Fetching all curated resources from Knowledge Base.");
        return resourceRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResourceDto> getResourcesByCategory(String category) {
        log.info("Fetching resources for category: {}", category);
        return resourceRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResourceDto> searchResourcesBySkill(String skill) {
        log.info("Searching resources for skill matching: {}", skill);
        return resourceRepository.findBySkill(skill).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ResourceDto mapToDto(Resource resource) {
        return ResourceDto.builder()
                .id(resource.getId())
                .title(resource.getTitle())
                .description(resource.getDescription())
                .url(resource.getUrl())
                .source(resource.getSource())
                .category(resource.getCategory())
                .difficulty(resource.getDifficulty())
                .estimatedLearningTime(resource.getEstimatedLearningTime())
                .skills(resource.getSkills())
                .tags(resource.getTags())
                .build();
    }
}
