package com.authentication.AuthProject.features.roadmap.entity;

import com.authentication.AuthProject.features.assessment.entity.Assessment;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "roadmap_milestones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(nullable = false, length = 50)
    private String monthLabel; // e.g. "Month 1"

    @Column(nullable = false, length = 255)
    private String topicName;

    @Lob
    @Column(nullable = true, columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isCompleted = false;

    @Column(nullable = true)
    private Instant completedAt;
}
