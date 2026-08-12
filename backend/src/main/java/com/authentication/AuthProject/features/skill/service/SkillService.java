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

        for (UserSkill userSkill : existing) {
            if (normalized.stream().noneMatch(s -> s.equalsIgnoreCase(userSkill.getSkillName()))) {
                userSkillRepository.delete(userSkill);
            }
        }

        for (String skillName : normalized) {
            if (userSkillRepository.findByUserIdAndSkillNameIgnoreCase(user.getId(), skillName).isEmpty()) {
                UserSkill userSkill = new UserSkill();
                userSkill.setUser(user);
                userSkill.setSkillName(skillName);
                userSkill.setSource("MANUAL");
                userSkill.setCreatedAt(Instant.now());
                userSkillRepository.save(userSkill);
            }
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
