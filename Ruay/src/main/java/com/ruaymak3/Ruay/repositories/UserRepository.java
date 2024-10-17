package com.ruaymak3.Ruay.repositories;

import com.ruaymak3.Ruay.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

}