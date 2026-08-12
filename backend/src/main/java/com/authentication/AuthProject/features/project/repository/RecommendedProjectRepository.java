package com.authentication.AuthProject.features.project.repository;

import com.authentication.AuthProject.features.project.entity.RecommendedProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendedProjectRepository extends JpaRepository<RecommendedProject, Long> {
    List<RecommendedProject> findByAssessmentId(Long assessmentId);
}
