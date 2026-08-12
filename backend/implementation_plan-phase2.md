# Implementation Plan - Phase 2: Database Refactoring

This phase establishes the relational database models (JPA Entities and Repository Interfaces) required to support the Career Compass AI Career Intelligence Platform. 

We will transition the project structure to a feature-based package layout (`auth`, `resume`, `skill`, `assessment`, `roadmap`, `resource`, `project`, `interview`, `knowledge`).

## User Review Required

> [!IMPORTANT]
> **Use of Long IDs vs UUIDs**: The existing `User` entity uses `Long` (auto-increment identity) for primary keys. We will continue using `Long` for all related table primary keys to maintain simplicity and compatibility.
> 
> **Package Relocation**: We will refactor the existing flat packages into feature-based packages under `com.authentication.AuthProject`. This keeps the codebase highly organized.

## Open Questions

> [!NOTE]
> None at this moment. The ERD details in `backend.md` and expected tables in `prompt.md` map clearly to JPA relations.

## Proposed Changes

### [Backend Packages & Entities]

We will create the following sub-packages under `com.authentication.AuthProject`:

---

### [Authentication Module Refactoring]
Move the existing auth classes into `com.authentication.AuthProject.auth` feature package to align package structures:
- `com.authentication.AuthProject.controller.AuthController` ➜ `com.authentication.AuthProject.auth.controller.AuthController`
- `com.authentication.AuthProject.service.AuthService` ➜ `com.authentication.AuthProject.auth.service.AuthService`
- `com.authentication.AuthProject.service.OtpService` ➜ `com.authentication.AuthProject.auth.service.OtpService`
- `com.authentication.AuthProject.service.OtpDeliveryService` ➜ `com.authentication.AuthProject.auth.service.OtpDeliveryService`
- `com.authentication.AuthProject.service.RateLimitService` ➜ `com.authentication.AuthProject.auth.service.RateLimitService`
- `com.authentication.AuthProject.service.MemcachedService` ➜ `com.authentication.AuthProject.auth.service.MemcachedService`
- `com.authentication.AuthProject.service.UserProfileCacheService` ➜ `com.authentication.AuthProject.auth.service.UserProfileCacheService`
- `com.authentication.AuthProject.entity.User` ➜ `com.authentication.AuthProject.auth.entity.User`
- `com.authentication.AuthProject.enums.Gender` ➜ `com.authentication.AuthProject.auth.enums.Gender`
- `com.authentication.AuthProject.repository.UserRepository` ➜ `com.authentication.AuthProject.auth.repository.UserRepository`
- `com.authentication.AuthProject.dto.*` ➜ `com.authentication.AuthProject.auth.dto.*`

---

### [Roles Module]
Create Role entity to track static industry roles.
#### [NEW] [Role.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/role/entity/Role.java)
- Primary Key: `Long id`
- Name (Unique): `String name` (e.g. `frontend-developer`, `backend-developer`)
- Description: `String description`
- Category: `String category`

#### [NEW] [RoleRepository.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/role/repository/RoleRepository.java)
- JPA Repository for Role.

---

### [Resumes Module]
Tracks user uploaded resume files and parsed text.
#### [NEW] [UserResume.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/resume/entity/UserResume.java)
- Primary Key: `Long id`
- Relation: `User user` (ManyToOne, JoinColumn `user_id`)
- FileName: `String fileName`
- FileType: `String fileType`
- FileSize: `Long fileSize`
- RawText: `String rawText` (LOB/Text column for holding extracted text)
- UploadedAt: `Instant uploadedAt`

#### [NEW] [UserResumeRepository.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/resume/repository/UserResumeRepository.java)
- JPA Repository for UserResume.

---

### [Skills Module]
Tracks user-acquired skills (manually entered or parsed from resume).
#### [NEW] [UserSkill.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/skill/entity/UserSkill.java)
- Primary Key: `Long id`
- Relation: `User user` (ManyToOne, JoinColumn `user_id`)
- SkillName: `String skillName`
- Source: `String source` (e.g., `MANUAL`, `RESUME`)
- CreatedAt: `Instant createdAt`
- Unique Constraint on `(user_id, skillName)`

#### [NEW] [UserSkillRepository.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/skill/repository/UserSkillRepository.java)
- JPA Repository for UserSkill.

---

### [Assessment & Recommendations Module]
Holds final assessment, gap analysis, career advice, and projects/roadmaps.
#### [NEW] [Assessment.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/assessment/entity/Assessment.java)
- Primary Key: `Long id`
- Relation: `User user` (ManyToOne, JoinColumn `user_id`)
- CurrentRole: `String currentRole`
- TargetRole: `String targetRole`
- Score: `Integer score`
- Strengths: `List<String>` (ElementCollection)
- Weaknesses: `List<String>` (ElementCollection)
- MissingSkills: `List<String>` (ElementCollection)
- Summary: `String summary` (LOB/Text)
- CareerAdvice: `String careerAdvice` (LOB/Text)
- CreatedAt: `Instant createdAt`

#### [NEW] [AssessmentRepository.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/assessment/repository/AssessmentRepository.java)
- JPA Repository for Assessment.

#### [NEW] [RoadmapMilestone.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/roadmap/entity/RoadmapMilestone.java)
- Primary Key: `Long id`
- Relation: `Assessment assessment` (ManyToOne, JoinColumn `assessment_id`)
- MonthLabel: `String monthLabel` (e.g. `Month 1`)
- TopicName: `String topicName`
- Description: `String description` (LOB/Text)
- IsCompleted: `Boolean isCompleted`
- CompletedAt: `Instant completedAt`

#### [NEW] [RoadmapMilestoneRepository.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/roadmap/repository/RoadmapMilestoneRepository.java)
- JPA Repository for RoadmapMilestone.

#### [NEW] [RecommendedProject.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/project/entity/RecommendedProject.java)
- Primary Key: `Long id`
- Relation: `Assessment assessment` (ManyToOne, JoinColumn `assessment_id`)
- Title: `String title`
- Description: `String description` (LOB/Text)
- Difficulty: `String difficulty`
- Duration: `String duration`
- IsCompleted: `Boolean isCompleted`
- CompletedAt: `Instant completedAt`

#### [NEW] [RecommendedProjectRepository.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/project/repository/RecommendedProjectRepository.java)
- JPA Repository for RecommendedProject.

#### [NEW] [InterviewPlan.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/interview/entity/InterviewPlan.java)
- Primary Key: `Long id`
- Relation: `Assessment assessment` (ManyToOne, JoinColumn `assessment_id`)
- PhaseLabel: `String phaseLabel` (e.g. `Phase 1: Foundations`)
- Topics: `List<String>` (ElementCollection)
- SampleQuestions: `List<String>` (ElementCollection)

#### [NEW] [InterviewPlanRepository.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/interview/repository/InterviewPlanRepository.java)
- JPA Repository for InterviewPlan.

---

### [Resources Module]
Knowledge base resources stored in database.
#### [NEW] [Resource.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/resource/entity/Resource.java)
- Primary Key: `Long id`
- Title: `String title`
- Description: `String description` (LOB/Text)
- Url: `String url` (Unique)
- Source: `String source` (e.g. GitHub, Roadmap.sh)
- Category: `String category`
- Difficulty: `String difficulty`
- EstimatedLearningTime: `String estimatedLearningTime`
- CreatedAt: `Instant createdAt`
- LastUpdated: `Instant lastUpdated`
- Skills: `Set<String>` (ElementCollection table `resource_skills`)
- Tags: `Set<String>` (ElementCollection table `resource_tags`)

#### [NEW] [ResourceRepository.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/resource/repository/ResourceRepository.java)
- JPA Repository for Resource.

---

### [Knowledge & Scheduler Module]
#### [NEW] [KnowledgeUpdate.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/knowledge/entity/KnowledgeUpdate.java)
- Primary Key: `Long id`
- RunTime: `Instant runTime`
- Status: `String status` (e.g. `SUCCESS`, `FAILED`)
- ResourcesAddedCount: `Integer resourcesAddedCount`
- Details: `String details`

#### [NEW] [KnowledgeUpdateRepository.java](file:///home/akash-sharma/React%20Project/Career%20Compass/backend/src/main/java/com/authentication/AuthProject/knowledge/repository/KnowledgeUpdateRepository.java)
- JPA Repository for KnowledgeUpdate.

## Verification Plan

### Automated Tests
- Run `mvn clean test` to ensure that all refactored auth tests compilation and unit tests execute cleanly under the new package layout.

### Manual Verification
- Start the application and check PostgreSQL using a test script or command to ensure Hibernate Auto-DDL creates/updates all tables, columns, and constraints without errors.
