package com.authentication.AuthProject.features.skill.service;

import com.authentication.AuthProject.features.skill.entity.UserSkill;
import com.authentication.AuthProject.features.skill.repository.UserSkillRepository;
import com.authentication.AuthProject.features.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final UserSkillRepository userSkillRepository;

    public List<String> getSkillNames(User user) {
        return userSkillRepository.findByUserId(user.getId()).stream()
                .map(UserSkill::getSkillName)
                .toList();
    }

    @Transactional
    public List<String> syncSkills(User user, List<String> skills) {
        List<String> normalized = normalizeSkills(skills);
        List<UserSkill> existing = userSkillRepository.findByUserId(user.getId());
        Set<String> normalizedLower = normalized.stream()
                .map(skill -> skill.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        List<UserSkill> toDelete = existing.stream()
                .filter(userSkill -> !normalizedLower.contains(userSkill.getSkillName().toLowerCase(Locale.ROOT)))
                .toList();
        if (!toDelete.isEmpty()) {
            userSkillRepository.deleteAllInBatch(toDelete);
        }

        Set<String> existingLower = existing.stream()
                .map(userSkill -> userSkill.getSkillName().toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());
        Instant now = Instant.now();
        List<UserSkill> toAdd = normalized.stream()
                .filter(skillName -> !existingLower.contains(skillName.toLowerCase(Locale.ROOT)))
                .map(skillName -> {
                    UserSkill userSkill = new UserSkill();
                    userSkill.setUser(user);
                    userSkill.setSkillName(skillName);
                    userSkill.setSource("MANUAL");
                    userSkill.setCreatedAt(now);
                    return userSkill;
                })
                .toList();
        if (!toAdd.isEmpty()) {
            userSkillRepository.saveAll(toAdd);
        }

        return getSkillNames(user);
    }

    private List<String> normalizeSkills(List<String> skills) {
        Map<String, String> deduped = new LinkedHashMap<>();
        for (String skill : skills) {
            if (skill == null) {
                continue;
            }
            String trimmed = skill.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            deduped.putIfAbsent(trimmed.toLowerCase(Locale.ROOT), trimmed);
        }
        return new ArrayList<>(deduped.values());
    }
}
