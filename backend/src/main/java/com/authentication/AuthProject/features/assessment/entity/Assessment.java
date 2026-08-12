package com.authentication.AuthProject.features.assessment.entity;

import com.authentication.AuthProject.features.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "current_role_title", nullable = false, length = 100)
    private String currentRole;

    @Column(nullable = false, length = 100)
    private String targetRole;

    @Column(nullable = false)
    private Integer score;

    @ElementCollection
    @CollectionTable(name = "assessment_strengths", joinColumns = @JoinColumn(name = "assessment_id"))
    @Column(name = "strength", length = 255)
    @Builder.Default
    private List<String> strengths = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "assessment_weaknesses", joinColumns = @JoinColumn(name = "assessment_id"))
    @Column(name = "weakness", length = 255)
    @Builder.Default
    private List<String> weaknesses = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "assessment_missing_skills", joinColumns = @JoinColumn(name = "assessment_id"))
    @Column(name = "missing_skill", length = 100)
    @Builder.Default
    private List<String> missingSkills = new ArrayList<>();

    @Lob
    @Column(nullable = true, columnDefinition = "TEXT")
    private String summary;

    @Lob
    @Column(nullable = true, columnDefinition = "TEXT")
    private String careerAdvice;

    @Column(nullable = false)
    private Instant createdAt;
}
