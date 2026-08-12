package com.authentication.AuthProject.features.skill.controller;

import com.authentication.AuthProject.features.skill.dto.SkillsSyncRequest;
import com.authentication.AuthProject.features.skill.service.SkillService;
import com.authentication.AuthProject.features.user.entity.User;
import com.authentication.AuthProject.features.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@Slf4j
public class SkillController {

    private final UserRepository userRepository;
    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<List<String>> getSkills() {
        User user = currentUser();
        log.info("Fetching skills for user: {}", user.getEmail());
        return ResponseEntity.ok(skillService.getSkillNames(user));
    }

    @PutMapping
    public ResponseEntity<List<String>> syncSkills(@Valid @RequestBody SkillsSyncRequest request) {
        User user = currentUser();
        log.info("Syncing {} skills for user: {}", request.getSkills().size(), user.getEmail());
        return ResponseEntity.ok(skillService.syncSkills(user, request.getSkills()));
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }
}
