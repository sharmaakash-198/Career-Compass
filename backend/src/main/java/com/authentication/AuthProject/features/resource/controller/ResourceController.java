package com.authentication.AuthProject.features.resource.controller;

import com.authentication.AuthProject.features.resource.dto.ResourceDto;
import com.authentication.AuthProject.features.resource.service.ResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@Slf4j
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<ResourceDto>> getAllResources() {
        log.info("API endpoint GET /api/resources called.");
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ResourceDto>> getResourcesByCategory(@PathVariable String category) {
        log.info("API endpoint GET /api/resources/category/{} called.", category);
        return ResponseEntity.ok(resourceService.getResourcesByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResourceDto>> searchResourcesBySkill(@RequestParam String skill) {
        log.info("API endpoint GET /api/resources/search?skill={} called.", skill);
        return ResponseEntity.ok(resourceService.searchResourcesBySkill(skill));
    }
}
