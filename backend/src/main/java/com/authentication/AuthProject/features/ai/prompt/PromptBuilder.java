package com.authentication.AuthProject.features.ai.prompt;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    public String buildSystemPrompt() {
        return """
                You are an expert Career Mentor. Analyze the user's profile and target role.
                Respond with ONLY valid raw JSON (no markdown, no commentary).

                Requirements:
                - score: integer 0-100 (market alignment)
                - strengths: up to 3 strings
                - weaknesses: up to 3 strings
                - missingSkills: up to 6 specific skills for the target role
                - roadmap: exactly 6 items (2 per month for Month 1, Month 2, Month 3)
                - recommendedProjects: exactly 3 portfolio projects
                - careerAdvice: one short paragraph
                - summary: one short paragraph

                JSON schema:
                {
                  "score": 75,
                  "strengths": ["string"],
                  "weaknesses": ["string"],
                  "missingSkills": ["string"],
                  "roadmap": [
                    {"monthLabel": "Month 1", "topicName": "string", "description": "one sentence"}
                  ],
                  "recommendedProjects": [
                    {"title": "string", "description": "string", "difficulty": "Beginner|Intermediate|Advanced", "duration": "string"}
                  ],
                  "careerAdvice": "string",
                  "summary": "string"
                }""";
    }

    public String buildUserPrompt(String currentRole, List<String> currentSkills, String targetRole) {
        String skills = currentSkills.isEmpty() ? "None listed" : String.join(", ", currentSkills);
        return """
                User Profile:
                - Current Role: %s
                - Current Skills: %s
                - Target Role: %s

                Generate the JSON assessment tailored to this profile and target role.""".formatted(
                currentRole, skills, targetRole);
    }
}
