package com.authentication.AuthProject.features.resume.controller;

import com.authentication.AuthProject.features.user.entity.User;
import com.authentication.AuthProject.features.user.repository.UserRepository;
import com.authentication.AuthProject.features.resume.service.ResumeParsingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final UserRepository userRepository;
    private final ResumeParsingService resumeParsingService;

    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadResume(@RequestParam("file") MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Resume upload request by user: {}, file: {}", email, file.getOriginalFilename());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        try {
            List<String> matchedSkills = resumeParsingService.processResumeUpload(user, file);
            return ResponseEntity.ok(matchedSkills);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid resume upload: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Failed to parse resume", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
