package com.authentication.AuthProject.features.assessment.entity;

import com.authentication.AuthProject.features.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "assessment_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentJob {

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssessmentJobStatus status;

    @Column(length = 500)
    private String errorMessage;

    @Column(name = "assessment_id")
    private Long assessmentId;

    @Column(name = "step")
    private Integer step;

    @Column(name = "step_message", length = 255)
    private String stepMessage;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    private Instant completedAt;
}
