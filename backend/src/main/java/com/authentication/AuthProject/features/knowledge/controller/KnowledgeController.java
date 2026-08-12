package com.authentication.AuthProject.features.knowledge.controller;

import com.authentication.AuthProject.features.knowledge.entity.KnowledgeUpdate;
import com.authentication.AuthProject.features.knowledge.repository.KnowledgeUpdateRepository;
import com.authentication.AuthProject.features.knowledge.service.KnowledgePipelineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge")
@RequiredArgsConstructor
@Slf4j
public class KnowledgeController {

    private final KnowledgePipelineService pipelineService;
    private final KnowledgeUpdateRepository updateRepository;

    @PostMapping("/sync")
    public ResponseEntity<KnowledgeUpdate> triggerSync() {
        log.info("Manual knowledge base synchronization triggered via POST request.");
        KnowledgeUpdate updateLog = pipelineService.synchronizeKnowledgeBase();
        return ResponseEntity.ok(updateLog);
    }

    @GetMapping("/updates")
    public ResponseEntity<List<KnowledgeUpdate>> getRecentUpdates() {
        log.info("Fetching recent knowledge base updates log history.");
        List<KnowledgeUpdate> logs = updateRepository.findTop5ByOrderByRunTimeDesc();
        return ResponseEntity.ok(logs);
    }
}
