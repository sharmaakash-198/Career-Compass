package com.authentication.AuthProject.features.resource.service;

import com.authentication.AuthProject.features.resource.dto.ResourceDto;
import com.authentication.AuthProject.features.resource.entity.Resource;
import com.authentication.AuthProject.features.resource.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private ResourceService resourceService;

    private Resource sampleResource;

    @BeforeEach
    void setUp() {
        sampleResource = Resource.builder()
                .id(1L)
                .title("Spring Boot Guide")
                .description("Complete Spring Boot tutorial.")
                .url("https://spring.io/guides")
                .source("Official Documentation")
                .category("Backend Development")
                .difficulty("INTERMEDIATE")
                .estimatedLearningTime("5 hours")
                .createdAt(Instant.now())
                .lastUpdated(Instant.now())
                .skills(Set.of("Java", "Spring Boot"))
                .tags(Set.of("spring", "backend"))
                .build();
    }

    @Test
    void getAllResources_returnsResourceDtoList() {
        when(resourceRepository.findAll()).thenReturn(List.of(sampleResource));

        List<ResourceDto> results = resourceService.getAllResources();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Spring Boot Guide", results.get(0).getTitle());
        verify(resourceRepository, times(1)).findAll();
    }

    @Test
    void getResourcesByCategory_returnsFilteredResources() {
        when(resourceRepository.findByCategoryIgnoreCase("Backend Development"))
                .thenReturn(List.of(sampleResource));

        List<ResourceDto> results = resourceService.getResourcesByCategory("Backend Development");

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Backend Development", results.get(0).getCategory());
        verify(resourceRepository, times(1)).findByCategoryIgnoreCase("Backend Development");
    }

    @Test
    void searchResourcesBySkill_returnsMatchingResources() {
        when(resourceRepository.findBySkill("Spring Boot"))
                .thenReturn(List.of(sampleResource));

        List<ResourceDto> results = resourceService.searchResourcesBySkill("Spring Boot");

        assertNotNull(results);
        assertEquals(1, results.size());
        assertTrue(results.get(0).getSkills().contains("Spring Boot"));
        verify(resourceRepository, times(1)).findBySkill("Spring Boot");
    }
}
