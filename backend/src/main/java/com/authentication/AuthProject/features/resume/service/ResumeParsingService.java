package com.authentication.AuthProject.features.resume.service;

import com.authentication.AuthProject.features.user.entity.User;
import com.authentication.AuthProject.features.resume.entity.UserResume;
import com.authentication.AuthProject.features.resume.repository.UserResumeRepository;
import com.authentication.AuthProject.features.skill.entity.UserSkill;
import com.authentication.AuthProject.features.skill.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeParsingService {

    private static final List<String> ALL_KNOWN_SKILLS = Arrays.asList(
            "Java", "Spring Boot", "Node.js", "Go", "Docker", "AWS", "CI/CD",
            "System Design", "PostgreSQL", "Redis", "Kubernetes", "GraphQL", "gRPC",
            "React", "TypeScript", "Tailwind CSS", "Next.js", "Redux", "Jest",
            "Webpack", "Vite", "HTML5", "CSS3", "Framer Motion", "REST APIs",
            "Express", "MongoDB", "Git", "Python", "PyTorch", "TensorFlow",
            "Scikit-learn", "LangChain", "CUDA", "Agentic AI", "MCP", "Hugging Face",
            "vector-databases", "SQL", "Pandas", "NumPy", "Tableau", "R",
            "Statistics", "Spark", "Machine Learning", "Data Visualisation",
            "Product Strategy", "Agile Methodology", "Jira", "Data Analytics",
            "User Research", "Wireframing", "A/B Testing", "Roadmapping"
    );

    private final ResumeTextExtractor textExtractor;
    private final UserResumeRepository userResumeRepository;
    private final UserSkillRepository userSkillRepository;

    @Transactional
    public List<String> processResumeUpload(User user, MultipartFile file) throws Exception {
        String extractedText = textExtractor.extract(file);
        if (extractedText.isBlank()) {
            throw new IllegalArgumentException("No text could be extracted from the resume");
        }

        UserResume resume = new UserResume();
        resume.setUser(user);
        resume.setFileName(file.getOriginalFilename());
        resume.setFileSize(file.getSize());
        resume.setRawText(extractedText);
        resume.setUploadedAt(Instant.now());
        userResumeRepository.save(resume);

        List<String> matchedSkills = matchSkills(extractedText);
        persistNewSkills(user, matchedSkills);
        log.info("Successfully extracted {} skills from resume and persisted.", matchedSkills.size());
        return matchedSkills;
    }

    private List<String> matchSkills(String text) {
        List<String> matched = new ArrayList<>();
        for (String skill : ALL_KNOWN_SKILLS) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(skill) + "\\b", Pattern.CASE_INSENSITIVE);
            if (pattern.matcher(text).find()) {
                matched.add(skill);
            }
        }
        return matched;
    }

    private void persistNewSkills(User user, List<String> skills) {
        Set<String> existingNames = userSkillRepository.findByUserId(user.getId()).stream()
                .map(skill -> skill.getSkillName().toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());
        Instant now = Instant.now();
        List<UserSkill> toAdd = new ArrayList<>();

        for (String skillName : skills) {
            if (existingNames.contains(skillName.toLowerCase(Locale.ROOT))) {
                continue;
            }
            UserSkill userSkill = new UserSkill();
            userSkill.setUser(user);
            userSkill.setSkillName(skillName);
            userSkill.setSource("RESUME");
            userSkill.setCreatedAt(now);
            toAdd.add(userSkill);
            existingNames.add(skillName.toLowerCase(Locale.ROOT));
        }

        if (!toAdd.isEmpty()) {
            userSkillRepository.saveAll(toAdd);
        }
    }
}
