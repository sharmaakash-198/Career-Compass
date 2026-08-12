package com.authentication.AuthProject.features.knowledge.service;

import com.authentication.AuthProject.features.knowledge.client.ResourceScraperClient;
import com.authentication.AuthProject.features.knowledge.dto.ScrapedResourceDto;
import com.authentication.AuthProject.features.knowledge.entity.KnowledgeUpdate;
import com.authentication.AuthProject.features.knowledge.repository.KnowledgeUpdateRepository;
import com.authentication.AuthProject.features.resource.entity.Resource;
import com.authentication.AuthProject.features.resource.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class KnowledgePipelineService {

    private final ResourceScraperClient scraperClient;
    private final ResourceRepository resourceRepository;
    private final KnowledgeUpdateRepository knowledgeUpdateRepository;

    @Transactional
    public KnowledgeUpdate synchronizeKnowledgeBase() {
        log.info("Starting knowledge base resource synchronization pipeline.");
        Instant startTime = Instant.now();
        int addedCount = 0;
        StringBuilder details = new StringBuilder();

        try {
            List<ScrapedResourceDto> scrapedFeeds = scraperClient.scrapeLatestResources();
            log.info("Fetched {} candidate resources from feeds.", scrapedFeeds.size());
            details.append("Fetched ").append(scrapedFeeds.size()).append(" candidate items.\n");

            for (ScrapedResourceDto feed : scrapedFeeds) {
                if (resourceRepository.findByUrl(feed.getUrl()).isPresent()) {
                    log.debug("Resource URL already exists in database, skipping: {}", feed.getUrl());
                    continue;
                }

                Resource resource = Resource.builder()
                        .title(feed.getTitle())
                        .description(feed.getDescription())
                        .url(feed.getUrl())
                        .source(feed.getSource())
                        .category(feed.getCategory())
                        .difficulty(feed.getDifficulty())
                        .estimatedLearningTime(feed.getEstimatedLearningTime())
                        .createdAt(Instant.now())
                        .lastUpdated(Instant.now())
                        .skills(feed.getSkills())
                        .tags(feed.getTags())
                        .build();

                resourceRepository.save(resource);
                addedCount++;
                log.info("Saved new resource: {}", resource.getTitle());
                details.append("Added: ").append(resource.getTitle()).append(" (").append(resource.getUrl()).append(")\n");
            }

            details.append("Sync completed successfully. Total added: ").append(addedCount);
            KnowledgeUpdate updateLog = KnowledgeUpdate.builder()
                    .runTime(startTime)
                    .status("SUCCESS")
                    .resourcesAddedCount(addedCount)
                    .details(details.toString())
                    .build();

            log.info("Knowledge base sync completed successfully. Added {} new resources.", addedCount);
            return knowledgeUpdateRepository.save(updateLog);

        } catch (Exception e) {
            log.error("Error occurred during knowledge base synchronization", e);
            KnowledgeUpdate updateLog = KnowledgeUpdate.builder()
                    .runTime(startTime)
                    .status("FAILED")
                    .resourcesAddedCount(0)
                    .details("Sync failed due to exception: " + e.getMessage())
                    .build();
            return knowledgeUpdateRepository.save(updateLog);
        }
    }
}
