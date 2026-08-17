package com.authentication.AuthProject.features.skill.service;

import com.authentication.AuthProject.features.skill.entity.UserSkill;
import com.authentication.AuthProject.features.skill.repository.UserSkillRepository;
import com.authentication.AuthProject.features.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SkillServiceTest {

    @InjectMocks
    private SkillService skillService;

    @Mock
    private UserSkillRepository userSkillRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("test@example.com").build();
    }

    @Test
    void syncSkills_addsManualSkillsAndRemovesMissingOnes() {
        UserSkill resumeSkill = UserSkill.builder()
                .id(10L)
                .user(user)
                .skillName("Java")
                .source("RESUME")
                .createdAt(Instant.now())
                .build();
        UserSkill manualSkill = UserSkill.builder()
                .id(11L)
                .user(user)
                .skillName("Python")
                .source("MANUAL")
                .createdAt(Instant.now())
                .build();
        UserSkill reactSkill = UserSkill.builder()
                .user(user)
                .skillName("React")
                .source("MANUAL")
                .createdAt(Instant.now())
                .build();

        when(userSkillRepository.findByUserId(1L))
                .thenReturn(new ArrayList<>(List.of(resumeSkill, manualSkill)))
                .thenReturn(new ArrayList<>(List.of(resumeSkill, reactSkill)));

        List<String> result = skillService.syncSkills(user, List.of("Java", "React"));

        verify(userSkillRepository).deleteAllInBatch(List.of(manualSkill));
        ArgumentCaptor<List<UserSkill>> saved = ArgumentCaptor.forClass(List.class);
        verify(userSkillRepository).saveAll(saved.capture());
        assertEquals("React", saved.getValue().get(0).getSkillName());
        assertEquals("MANUAL", saved.getValue().get(0).getSource());
        assertEquals(List.of("Java", "React"), result);
    }

    @Test
    void syncSkills_deduplicatesCaseInsensitive() {
        UserSkill reactSkill = UserSkill.builder()
                .user(user)
                .skillName("react")
                .source("MANUAL")
                .createdAt(Instant.now())
                .build();

        when(userSkillRepository.findByUserId(1L))
                .thenReturn(new ArrayList<>())
                .thenReturn(new ArrayList<>(List.of(reactSkill)));

        List<String> result = skillService.syncSkills(user, List.of("react", "React", " REACT "));

        verify(userSkillRepository).saveAll(anyList());
        assertEquals(List.of("react"), result);
    }
}
