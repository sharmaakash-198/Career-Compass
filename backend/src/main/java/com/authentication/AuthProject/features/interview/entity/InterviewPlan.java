package com.authentication.AuthProject.features.interview.entity;

import com.authentication.AuthProject.features.assessment.entity.Assessment;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interview_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(nullable = false, length = 100)
    private String phaseLabel; // e.g. "Phase 1: Foundations"

    @ElementCollection
    @CollectionTable(name = "interview_plan_topics", joinColumns = @JoinColumn(name = "interview_plan_id"))
    @Column(name = "topic", length = 255)
    @Builder.Default
    private List<String> topics = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "interview_plan_questions", joinColumns = @JoinColumn(name = "interview_plan_id"))
    @Column(name = "question", length = 1000)
    @Builder.Default
    private List<String> sampleQuestions = new ArrayList<>();
}
