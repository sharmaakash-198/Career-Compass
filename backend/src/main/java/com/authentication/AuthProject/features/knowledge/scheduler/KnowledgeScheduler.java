package com.authentication.AuthProject.features.knowledge.scheduler;

import com.authentication.AuthProject.features.knowledge.service.KnowledgePipelineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KnowledgeScheduler {

    private final KnowledgePipelineService pipelineService;

    // Run weekly at 2:00 AM on Sundays
    @Scheduled(cron = "0 0 2 * * SUN")
    public void runWeeklySync() {
        log.info("Scheduled task runWeeklySync triggered.");
        try {
            pipelineService.synchronizeKnowledgeBase();
        } catch (Exception e) {
            log.error("Failed executing scheduled resource sync task", e);
        }
    }
}
