package com.authentication.AuthProject.features.resume.repository;

import com.authentication.AuthProject.features.resume.entity.UserResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserResumeRepository extends JpaRepository<UserResume, Long> {
    List<UserResume> findByUserId(Long userId);
}
