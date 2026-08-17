package com.authentication.AuthProject.features.auth.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Long userId;
    private String message;
    private String accessToken;
    private String refreshToken;
    private String fullName;
    private String email;
    private Boolean hasAssessment;
}
