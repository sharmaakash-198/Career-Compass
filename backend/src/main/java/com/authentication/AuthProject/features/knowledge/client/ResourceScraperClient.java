package com.authentication.AuthProject.features.knowledge.client;

import com.authentication.AuthProject.features.knowledge.dto.ScrapedResourceDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class ResourceScraperClient {

    public List<ScrapedResourceDto> scrapeLatestResources() {
        List<ScrapedResourceDto> resources = new ArrayList<>();

        resources.add(ScrapedResourceDto.builder()
                .title("Spring Boot Reference Documentation")
                .description("Official reference guide covering core features, security, database access, and testing in Spring Boot.")
                .url("https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/")
                .source("Official Documentation")
                .category("Backend Development")
                .difficulty("INTERMEDIATE")
                .estimatedLearningTime("10 hours")
                .skills(Set.of("Java", "Spring Boot", "REST APIs"))
                .tags(Set.of("reference", "spring", "docs"))
                .build());

        resources.add(ScrapedResourceDto.builder()
                .title("System Design Primer")
                .description("Learn how to build large-scale systems. Prep for the system design interview. Includes solutions and diagrams.")
                .url("https://github.com/donnemartin/system-design-primer")
                .source("GitHub")
                .category("System Design")
                .difficulty("ADVANCED")
                .estimatedLearningTime("20 hours")
                .skills(Set.of("System Design", "Redis", "PostgreSQL", "Kubernetes"))
                .tags(Set.of("github", "architecture", "scalability"))
                .build());

        resources.add(ScrapedResourceDto.builder()
                .title("Next.js 15 Full Course 2026")
                .description("Learn Next.js 15 by building a full-stack dashboard with React, TypeScript, Tailwind CSS, and database integration.")
                .url("https://www.youtube.com/watch?v=nextjs15-full-course")
                .source("YouTube")
                .category("Frontend Development")
                .difficulty("BEGINNER")
                .estimatedLearningTime("4 hours")
                .skills(Set.of("React", "TypeScript", "Tailwind CSS", "Next.js"))
                .tags(Set.of("youtube", "nextjs", "frontend", "video"))
                .build());

        resources.add(ScrapedResourceDto.builder()
                .title("Backend Developer Roadmap")
                .description("Step-by-step guide and educational pathways to becoming a modern backend developer in 2026.")
                .url("https://roadmap.sh/backend")
                .source("Roadmap.sh")
                .category("Backend Development")
                .difficulty("BEGINNER")
                .estimatedLearningTime("40 hours")
                .skills(Set.of("Java", "Spring Boot", "PostgreSQL", "Docker", "Git", "CI/CD"))
                .tags(Set.of("roadmap", "backend", "career-path"))
                .build());

        resources.add(ScrapedResourceDto.builder()
                .title("Docker and Kubernetes: The Complete Guide")
                .description("Build, test, and deploy containers with Docker and Kubernetes from scratch.")
                .url("https://roadmap.sh/guides/docker-kubernetes-guide")
                .source("Roadmap.sh")
                .category("DevOps")
                .difficulty("INTERMEDIATE")
                .estimatedLearningTime("8 hours")
                .skills(Set.of("Docker", "Kubernetes", "CI/CD"))
                .tags(Set.of("devops", "containers", "deployment"))
                .build());

        return resources;
    }
}
