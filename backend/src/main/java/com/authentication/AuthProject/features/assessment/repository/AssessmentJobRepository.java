package com.authentication.AuthProject.features.assessment.repository;

import com.authentication.AuthProject.features.assessment.entity.AssessmentJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssessmentJobRepository extends JpaRepository<AssessmentJob, Long> {
    Optional<AssessmentJob> findByIdAndUserId(Long id, Long userId);
}
