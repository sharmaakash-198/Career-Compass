package com.authentication.AuthProject.features.project.entity;

import com.authentication.AuthProject.features.assessment.entity.Assessment;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "recommended_projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendedProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob
    @Column(nullable = true, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = true, length = 50)
    private String difficulty; // e.g. "Beginner", "Intermediate"

    @Column(nullable = true, length = 50)
    private String duration; // e.g. "2 weeks", "1 month"

    @Builder.Default
    @Column(nullable = false)
    private Boolean isCompleted = false;

    @Column(nullable = true)
    private Instant completedAt;
}
