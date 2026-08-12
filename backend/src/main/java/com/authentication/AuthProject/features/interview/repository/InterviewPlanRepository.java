package com.authentication.AuthProject.features.interview.repository;

import com.authentication.AuthProject.features.interview.entity.InterviewPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewPlanRepository extends JpaRepository<InterviewPlan, Long> {
    List<InterviewPlan> findByAssessmentId(Long assessmentId);
}
