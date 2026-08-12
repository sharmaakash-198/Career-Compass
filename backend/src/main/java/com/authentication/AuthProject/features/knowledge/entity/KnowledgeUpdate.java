package com.authentication.AuthProject.features.knowledge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "knowledge_updates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Instant runTime;

    @Column(nullable = false, length = 20)
    private String status; // e.g. "SUCCESS", "FAILED"

    @Column(nullable = false)
    private Integer resourcesAddedCount;

    @Column(nullable = true, length = 1000)
    private String details;
}
