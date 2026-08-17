package com.authentication.AuthProject.core.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey",
                "01234567890123456789012345678901"); // 32 chars for HS256
        ReflectionTestUtils.setField(jwtService, "accessExpiration", 3_600_000L);
        ReflectionTestUtils.setField(jwtService, "refreshExpiration", 7_200_000L);
    }

    @Test
    void generateAccessToken_and_extractUsername_shouldNormalizeEmail() {
        String token = jwtService.generateAccessToken("  Test@Gmail.com ");

        assertEquals("test@gmail.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isAccessToken(token));
        assertTrue(jwtService.isAccessTokenValid(token, "TEST@gmail.com"));
        assertFalse(jwtService.isRefreshToken(token));
    }

    @Test
    void generateRefreshToken_shouldNotBeValidAsAccessToken() {
        String refreshToken = jwtService.generateRefreshToken("user@gmail.com");

        assertTrue(jwtService.isRefreshToken(refreshToken));
        assertTrue(jwtService.isRefreshTokenValid(refreshToken, "user@gmail.com"));
        assertFalse(jwtService.isAccessToken(refreshToken));
        assertFalse(jwtService.isAccessTokenValid(refreshToken, "user@gmail.com"));
    }

    @Test
    void isAccessTokenValid_shouldReturnFalse_whenEmailDoesNotMatch() {
        String token = jwtService.generateAccessToken("user@gmail.com");

        assertFalse(jwtService.isAccessTokenValid(token, "other@gmail.com"));
    }

    @Test
    void isAccessTokenValid_shouldRejectExpiredToken() {
        ReflectionTestUtils.setField(jwtService, "accessExpiration", -1_000L);
        String token = jwtService.generateAccessToken("user@gmail.com");

        assertThrows(ExpiredJwtException.class,
                () -> jwtService.isAccessTokenValid(token, "user@gmail.com"));
    }
}
