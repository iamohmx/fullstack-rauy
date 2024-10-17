package com.ruaymak3.Ruay.repositories;
import com.ruaymak3.Ruay.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String role);
}