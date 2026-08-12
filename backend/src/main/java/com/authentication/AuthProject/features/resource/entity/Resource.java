package com.authentication.AuthProject.features.resource.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob
    @Column(nullable = true, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, unique = true, length = 512)
    private String url;

    @Column(nullable = false, length = 100)
    private String source; // e.g. GitHub, Roadmap.sh, YouTube, Blogs

    @Column(nullable = true, length = 100)
    private String category;

    @Column(nullable = true, length = 50)
    private String difficulty; // e.g. BEGINNER, INTERMEDIATE, ADVANCED

    @Column(nullable = true, length = 50)
    private String estimatedLearningTime;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant lastUpdated;

    @ElementCollection
    @CollectionTable(name = "resource_skills", joinColumns = @JoinColumn(name = "resource_id"))
    @Column(name = "skill_name", length = 100)
    @Builder.Default
    private Set<String> skills = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "resource_tags", joinColumns = @JoinColumn(name = "resource_id"))
    @Column(name = "tag", length = 100)
    @Builder.Default
    private Set<String> tags = new HashSet<>();
}
