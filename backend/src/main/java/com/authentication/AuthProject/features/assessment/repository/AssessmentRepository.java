package com.authentication.AuthProject.features.assessment.repository;

import com.authentication.AuthProject.features.assessment.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByUserId(Long userId);
    List<Assessment> findByUserIdOrderByCreatedAtDesc(Long userId);
}
