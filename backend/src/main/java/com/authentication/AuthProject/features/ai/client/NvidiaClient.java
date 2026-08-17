package com.authentication.AuthProject.features.ai.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class NvidiaClient {

    @Value("${nvidia.api-key}")
    private String apiKey;

    @Value("${nvidia.model}")
    private String model;

    @Value("${nvidia.base-url}")
    private String baseUrl;

    @Value("${nvidia.max-tokens:2048}")
    private int maxTokens;

    @Value("${nvidia.read-timeout-ms:120000}")
    private int readTimeoutMs;

    private RestTemplate restTemplate;

    private RestTemplate getRestTemplate() {
        if (restTemplate == null) {
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(10_000);
            factory.setReadTimeout(readTimeoutMs);
            restTemplate = new RestTemplate(factory);
        }
        return restTemplate;
    }

    public String callInference(String systemPrompt, String userPrompt) {
        if (apiKey == null || apiKey.trim().isEmpty() || "MOCK".equalsIgnoreCase(apiKey.trim())) {
            log.info("NVIDIA API key not configured or set to MOCK. Executing in local mock fallback mode.");
            return getMockResponse(userPrompt);
        }

        log.info("Sending chat completion request to NVIDIA NIM API model: {}", model);
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
            ));
            requestBody.put("temperature", 0.2);
            requestBody.put("max_tokens", maxTokens);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = baseUrl + "/chat/completions";

            ResponseEntity<Map> responseEntity = getRestTemplate().postForEntity(url, entity, Map.class);
            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                List<Map> choices = (List<Map>) responseEntity.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map message = (Map) choices.get(0).get("message");
                    if (message != null) {
                        return (String) message.get("content");
                    }
                }
            }
            throw new RuntimeException("Empty or invalid response from NVIDIA NIM API. Status: " + responseEntity.getStatusCode());
        } catch (Exception e) {
            log.error("Failed to execute request to NVIDIA NIM API", e);
            throw new RuntimeException("NVIDIA Inference failed: " + e.getMessage(), e);
        }
    }

    private String getMockResponse(String userPrompt) {
        // Detect target role from prompt to make mock highly realistic
        String targetRole = "Backend Developer";
        if (userPrompt.toLowerCase().contains("frontend")) {
            targetRole = "Frontend Developer";
        } else if (userPrompt.toLowerCase().contains("data") || userPrompt.toLowerCase().contains("ai")) {
            targetRole = "Data Scientist";
        } else if (userPrompt.toLowerCase().contains("design")) {
            targetRole = "UI/UX Designer";
        }

        return "{\n" +
                "  \"score\": 65,\n" +
                "  \"strengths\": [\n" +
                "    \"Solid core coding capabilities\",\n" +
                "    \"Understand foundational databases and version control (Git)\"\n" +
                "  ],\n" +
                "  \"weaknesses\": [\n" +
                "    \"Lacks deployment pipelines and containerization knowledge\",\n" +
                "    \"Missing production-level experience in target frameworks\"\n" +
                "  ],\n" +
                "  \"missingSkills\": [\n" +
                "    \"Docker\",\n" +
                "    \"Kubernetes\",\n" +
                "    \"CI/CD\"\n" +
                "  ],\n" +
                "  \"roadmap\": [\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 1\",\n" +
                "      \"topicName\": \"Containerization with Docker\",\n" +
                "      \"description\": \"Learn Dockerfile configurations, build optimization, and running multi-container stacks via Compose.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 2\",\n" +
                "      \"topicName\": \"Kubernetes Basics\",\n" +
                "      \"description\": \"Learn Pods, Deployments, Cluster services, and handling configuration resources locally (Minikube).\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"monthLabel\": \"Month 3\",\n" +
                "      \"topicName\": \"Automated CI/CD Pipelines\",\n" +
                "      \"description\": \"Build integration tasks using GitHub Actions to automatically run tests and publish docker images.\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"recommendedResources\": [\n" +
                "    {\n" +
                "      \"title\": \"Docker and Kubernetes: The Complete Guide\",\n" +
                "      \"description\": \"Build, test, and deploy containers with Docker and Kubernetes from scratch.\",\n" +
                "      \"url\": \"https://roadmap.sh/guides/docker-kubernetes-guide\",\n" +
                "      \"source\": \"Roadmap.sh\",\n" +
                "      \"category\": \"DevOps\",\n" +
                "      \"difficulty\": \"INTERMEDIATE\",\n" +
                "      \"estimatedLearningTime\": \"8 hours\",\n" +
                "      \"skills\": [\"Docker\", \"Kubernetes\"],\n" +
                "      \"tags\": [\"containers\", \"devops\"]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"recommendedProjects\": [\n" +
                "    {\n" +
                "      \"title\": \"Dockerized Spring API Deployer\",\n" +
                "      \"description\": \"Containerize your Spring Boot application and establish a Github Actions pipeline that builds and publishes images.\",\n" +
                "      \"difficulty\": \"Intermediate\",\n" +
                "      \"duration\": \"2 weeks\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"careerAdvice\": \"Given your target of " + targetRole + ", you should concentrate on infrastructure automation. Focus on practical deployments on public clouds or local Kubernetes clusters.\",\n" +
                "  \"summary\": \"You have a good foundational coding background, but require hands-on DevOps and deployment skills to fit modern backend developer profiles.\"\n" +
                "}";
    }
}
