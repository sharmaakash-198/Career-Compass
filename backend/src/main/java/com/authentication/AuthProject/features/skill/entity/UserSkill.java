package com.authentication.AuthProject.features.skill.entity;

import com.authentication.AuthProject.features.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
    name = "user_skills",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "skill_name"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(nullable = false, length = 20)
    private String source; // e.g. "MANUAL", "RESUME"

    @Column(nullable = false)
    private Instant createdAt;
}
