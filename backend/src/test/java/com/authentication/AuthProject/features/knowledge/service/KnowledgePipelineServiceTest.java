package com.authentication.AuthProject.features.knowledge.service;

import com.authentication.AuthProject.features.knowledge.client.ResourceScraperClient;
import com.authentication.AuthProject.features.knowledge.dto.ScrapedResourceDto;
import com.authentication.AuthProject.features.knowledge.entity.KnowledgeUpdate;
import com.authentication.AuthProject.features.knowledge.repository.KnowledgeUpdateRepository;
import com.authentication.AuthProject.features.resource.entity.Resource;
import com.authentication.AuthProject.features.resource.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class KnowledgePipelineServiceTest {

    @Mock
    private ResourceScraperClient scraperClient;

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private KnowledgeUpdateRepository knowledgeUpdateRepository;

    @InjectMocks
    private KnowledgePipelineService pipelineService;

    private ScrapedResourceDto sampleDto;

    @BeforeEach
    void setUp() {
        sampleDto = ScrapedResourceDto.builder()
                .title("Sample Title")
                .description("Sample Desc")
                .url("https://example.com/sample")
                .source("YouTube")
                .category("DevOps")
                .difficulty("BEGINNER")
                .estimatedLearningTime("1 hour")
                .skills(Set.of("Docker"))
                .tags(Set.of("test"))
                .build();
    }

    @Test
    void testSynchronizeKnowledgeBase_Success() {
        // Arrange
        when(scraperClient.scrapeLatestResources()).thenReturn(List.of(sampleDto));
        when(resourceRepository.findByUrl(sampleDto.getUrl())).thenReturn(Optional.empty());
        when(resourceRepository.save(any(Resource.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(knowledgeUpdateRepository.save(any(KnowledgeUpdate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        KnowledgeUpdate result = pipelineService.synchronizeKnowledgeBase();

        // Assert
        assertNotNull(result);
        assertEquals("SUCCESS", result.getStatus());
        assertEquals(1, result.getResourcesAddedCount());
        verify(resourceRepository, times(1)).save(any(Resource.class));
        verify(knowledgeUpdateRepository, times(1)).save(any(KnowledgeUpdate.class));
    }

    @Test
    void testSynchronizeKnowledgeBase_FilterDuplicates() {
        // Arrange
        when(scraperClient.scrapeLatestResources()).thenReturn(List.of(sampleDto));
        when(resourceRepository.findByUrl(sampleDto.getUrl())).thenReturn(Optional.of(new Resource()));
        when(knowledgeUpdateRepository.save(any(KnowledgeUpdate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        KnowledgeUpdate result = pipelineService.synchronizeKnowledgeBase();

        // Assert
        assertNotNull(result);
        assertEquals("SUCCESS", result.getStatus());
        assertEquals(0, result.getResourcesAddedCount());
        verify(resourceRepository, never()).save(any(Resource.class));
        verify(knowledgeUpdateRepository, times(1)).save(any(KnowledgeUpdate.class));
    }

    @Test
    void testSynchronizeKnowledgeBase_Failure() {
        // Arrange
        when(scraperClient.scrapeLatestResources()).thenThrow(new RuntimeException("Scraping failed"));
        when(knowledgeUpdateRepository.save(any(KnowledgeUpdate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        KnowledgeUpdate result = pipelineService.synchronizeKnowledgeBase();

        // Assert
        assertNotNull(result);
        assertEquals("FAILED", result.getStatus());
        assertEquals(0, result.getResourcesAddedCount());
        assertTrue(result.getDetails().contains("Scraping failed"));
        verify(resourceRepository, never()).save(any(Resource.class));
        verify(knowledgeUpdateRepository, times(1)).save(any(KnowledgeUpdate.class));
    }
}
