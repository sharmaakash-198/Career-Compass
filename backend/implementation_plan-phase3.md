# Implementation Plan - Phase 3: Knowledge Ingestion Pipeline

This phase implements the backend scheduler and pipeline logic for collecting, parsing, and persisting external learning resources (from sources like GitHub, Roadmap.sh, official docs, etc.) into the postgres database to serve as our career knowledge base.

## Architecture Overview

1. **Why it exists**: The Knowledge Pipeline ensures the platform has an up-to-date catalog of high-quality learning resources to match against skill gaps.
2. **Where it fits**: It runs as a background service managed by Spring Scheduler.
3. **API Design**: Exposes `POST /api/knowledge/sync` (secured for ADMIN role, or temporarily public for testing) to allow manual execution of the sync pipeline.
4. **Mock Extraction**: Since NVIDIA client integration occurs in Phase 4, Phase 3 will use a structured parser service that simulates the extraction of skills/tags from standard metadata.

```mermaid
sequenceDiagram
    participant Scheduler as Spring Scheduler (Weekly)
    participant Controller as KnowledgeController
    participant Service as KnowledgePipelineService
    participant SourceClient as ResourceScraperClient
    participant DB as PostgreSQL
    
    Scheduler->>Service: triggerSync()
    Controller->>Service: triggerSync() (Manual POST)
    Service->>SourceClient: fetchLatestResources()
    SourceClient-->>Service: Return raw resource links & summaries
    Note over Service: Extract skills, tags, category & difficulty<br/>(Mocked; replaced by NVIDIA AI in Phase 4)
    Service->>DB: Save to resources, resource_skills, resource_tags
    Service->>DB: Log sync status to knowledge_updates
```

## User Review Required

> [!IMPORTANT]
> **Source Feeds**: For the initial integration, we will build a scraper client that simulates pulling from popular RSS/JSON feeds from `Roadmap.sh`, `GitHub Trending`, and official documentation.
> 
> **Authentication for Manual Sync**: The manual trigger endpoint `POST /api/knowledge/sync` will require the `Authorization` header with a valid JWT token.

## Proposed Changes

### [Knowledge & Scheduler Module]

#### [NEW] [KnowledgePipelineService.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/knowledge/service/KnowledgePipelineService.java)
- Manages the orchestration of:
  1. Triggering resource sync.
  2. Scraped resource filtering.
  3. Extracting metadata (mocked model parser).
  4. Database persistence and update logging.

#### [NEW] [KnowledgeScheduler.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/knowledge/scheduler/KnowledgeScheduler.java)
- Uses `@Scheduled(cron = "0 0 2 * * SUN")` (weekly at 2:00 AM Sundays) to run the sync automatically.

#### [NEW] [KnowledgeController.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/knowledge/controller/KnowledgeController.java)
- Exposes `POST /api/knowledge/sync` to trigger the sync pipeline manually.
- Exposes `GET /api/knowledge/updates` to fetch recent knowledge update log status.

#### [NEW] [ResourceScraperClient.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/knowledge/client/ResourceScraperClient.java)
- Mock client returning structured feed items representing tutorials, videos, and articles from YouTube, Roadmap.sh, and GitHub.

## Verification Plan

### Automated Tests
- Create unit tests for `KnowledgePipelineService` verifying correct handling of duplicate URLs, exception scenarios, and logging of runs.
- Run `mvn test` to verify build compilation.

### Manual Verification
- Start the server, hit `POST /api/knowledge/sync` using an HTTP request client, and verify that the `resources` and `knowledge_updates` tables are populated.
