package com.authentication.AuthProject.features.roadmap.repository;

import com.authentication.AuthProject.features.roadmap.entity.RoadmapMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapMilestoneRepository extends JpaRepository<RoadmapMilestone, Long> {
    List<RoadmapMilestone> findByAssessmentId(Long assessmentId);
    List<RoadmapMilestone> findByAssessmentIdOrderByMonthLabelAsc(Long assessmentId);
}
