package com.authentication.AuthProject.features.knowledge.repository;

import com.authentication.AuthProject.features.knowledge.entity.KnowledgeUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeUpdateRepository extends JpaRepository<KnowledgeUpdate, Long> {
    List<KnowledgeUpdate> findTop5ByOrderByRunTimeDesc();
}
