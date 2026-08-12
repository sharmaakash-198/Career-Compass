package com.authentication.AuthProject.features.ai.prompt;

import com.authentication.AuthProject.features.resource.entity.Resource;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    public String buildSystemPrompt() {
        return "You are an expert Career Mentor and AI Career Intelligence Agent.\n" +
                "Your task is to analyze the user's current profile, skills, and target career role, compare them against industry standards, and recommend learning resources from the provided list.\n\n" +
                "CRITICAL ROADMAP REQUIREMENT: You MUST generate 3 to 4 SEPARATE milestone objects per month (e.g. 3 separate items with \"monthLabel\": \"Month 1\", 3 separate items with \"monthLabel\": \"Month 2\", 3 separate items with \"monthLabel\": \"Month 3\"). Each item MUST focus on one specific sub-topic or skill with its own title and a 1-sentence description. DO NOT combine multiple topics into a single month item.\n\n" +
                "CRITICAL PROJECT REQUIREMENT: You MUST recommend at least 5 distinct, high-impact portfolio projects in the 'recommendedProjects' array.\n\n" +
                "CRITICAL: You MUST respond with ONLY a valid, single JSON object containing the exact structure below. Do NOT add any conversational explanation, markdown formatting (like ```json ... ```), or notes. The response must be a parseable raw JSON string.\n\n" +
                "JSON Output Schema:\n" +
                "{\n" +
                "  \"score\": 75, // Market alignment/fit percentage score (integer between 0 and 100)\n" +
                "  \"strengths\": [\"string\"], // List of user's key strengths (up to 3)\n" +
                "  \"weaknesses\": [\"string\"], // List of user's core gaps/weaknesses (up to 3)\n" +
                "  \"missingSkills\": [\"string\"], // Specific technical skills needed for target role\n" +
                "  \"roadmap\": [\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 1\",\n" +
                "      \"topicName\": \"Next.js Routing & SSR\",\n" +
                "      \"description\": \"Master file-based routing, server-side rendering, and static site generation.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 1\",\n" +
                "      \"topicName\": \"Next.js API Routes\",\n" +
                "      \"description\": \"Build backend endpoint handlers and serverless functions.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 1\",\n" +
                "      \"topicName\": \"Full-Stack Node.js Application\",\n" +
                "      \"description\": \"Implement a full-stack application connecting Next.js with a Node.js backend.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 2\",\n" +
                "      \"topicName\": \"System Design Principles\",\n" +
                "      \"description\": \"Study core principles of high-availability system architecture.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 2\",\n" +
                "      \"topicName\": \"Microservices Architecture\",\n" +
                "      \"description\": \"Design decoupled microservices using gRPC and REST interfaces.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 2\",\n" +
                "      \"topicName\": \"Scalability & Load Balancing\",\n" +
                "      \"description\": \"Implement load balancers, caching, and horizontal database scaling.\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"recommendedResources\": [\n" +
                "    {\n" +
                "      \"title\": \"Title matching one of the provided resources\",\n" +
                "      \"description\": \"Brief description\",\n" +
                "      \"url\": \"Exact URL from the provided resource list\",\n" +
                "      \"source\": \"Source from provided list\",\n" +
                "      \"category\": \"Category from list\",\n" +
                "      \"difficulty\": \"Difficulty from list\",\n" +
                "      \"estimatedLearningTime\": \"Estimated learning time\",\n" +
                "      \"skills\": [\"associated skills\"],\n" +
                "      \"tags\": [\"associated tags\"]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"recommendedProjects\": [\n" +
                "    {\n" +
                "      \"title\": \"Project Title\",\n" +
                "      \"description\": \"Description of a highly relevant portfolio project that can bridge gaps.\",\n" +
                "      \"difficulty\": \"Beginner/Intermediate/Advanced\",\n" +
                "      \"duration\": \"Estimated duration e.g. 2 weeks\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"interviewPreparation\": [\n" +
                "    {\n" +
                "      \"phaseLabel\": \"Phase 1: Title\",\n" +
                "      \"topics\": [\"topic1\", \"topic2\"],\n" +
                "      \"sampleQuestions\": [\"question1\", \"question2\"]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"careerAdvice\": \"General advice for this career transition.\",\n" +
                "  \"summary\": \"Short paragraph summarizing user's profile and readiness.\"\n" +
                "}";
    }

    public String buildUserPrompt(String currentRole, List<String> currentSkills, String targetRole, List<Resource> availableResources) {
        StringBuilder sb = new StringBuilder();
        sb.append("User Profile Details:\n");
        sb.append("- Current Role: ").append(currentRole).append("\n");
        sb.append("- Current Acquired Skills: ").append(String.join(", ", currentSkills)).append("\n");
        sb.append("- Target Desired Role: ").append(targetRole).append("\n\n");

        sb.append("Available Database Learning Resources (You must select from these to populate 'recommendedResources'):\n");
        if (availableResources.isEmpty()) {
            sb.append("- None (generate standard resources if database is empty).\n");
        } else {
            for (Resource r : availableResources) {
                sb.append("- Title: ").append(r.getTitle()).append("\n");
                sb.append("  URL: ").append(r.getUrl()).append("\n");
                sb.append("  Source: ").append(r.getSource()).append("\n");
                sb.append("  Skills targeted: ").append(String.join(", ", r.getSkills())).append("\n");
                sb.append("  Tags: ").append(String.join(", ", r.getTags())).append("\n\n");
            }
        }

        sb.append("Please analyze the gaps and generate the structured JSON object response matching the requested schema. Ensure all fields are filled.");
        return sb.toString();
    }
}
