package com.authentication.AuthProject.features.resource.repository;

import com.authentication.AuthProject.features.resource.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Optional<Resource> findByUrl(String url);

    List<Resource> findByCategoryIgnoreCase(String category);

    @Query("SELECT DISTINCT r FROM Resource r JOIN r.skills s WHERE LOWER(s) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<Resource> findBySkill(@Param("skill") String skill);
}
