package com.authentication.AuthProject.features.resume.entity;

import com.authentication.AuthProject.features.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = true, length = 100)
    private String fileType;

    @Column(nullable = true)
    private Long fileSize;

    @Lob
    @Column(nullable = true, columnDefinition = "TEXT")
    private String rawText;

    @Column(nullable = false)
    private Instant uploadedAt;
}
