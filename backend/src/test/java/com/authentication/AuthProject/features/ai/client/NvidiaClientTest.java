package com.authentication.AuthProject.features.ai.client;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

public class NvidiaClientTest {

    private NvidiaClient nvidiaClient;

    @BeforeEach
    void setUp() {
        nvidiaClient = new NvidiaClient();
        ReflectionTestUtils.setField(nvidiaClient, "apiKey", "MOCK");
        ReflectionTestUtils.setField(nvidiaClient, "model", "llama-model");
        ReflectionTestUtils.setField(nvidiaClient, "baseUrl", "https://api.nvidia.com");
    }

    @Test
    void testCallInference_MockFallback() {
        // Act
        String response = nvidiaClient.callInference("system-instructions", "I want to be a Backend Developer");

        // Assert
        assertNotNull(response);
        assertTrue(response.contains("\"score\":"));
        assertTrue(response.contains("Backend Developer"));
        assertTrue(response.contains("Docker"));
    }
}
