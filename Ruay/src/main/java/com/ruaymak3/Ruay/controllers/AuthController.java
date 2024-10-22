package com.ruaymak3.Ruay.controllers;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.ruaymak3.Ruay.dto.LoginDto;
import com.ruaymak3.Ruay.dto.SignUpDto;
import com.ruaymak3.Ruay.models.Role;
import com.ruaymak3.Ruay.models.User;
import com.ruaymak3.Ruay.repositories.RoleRepository;
import com.ruaymak3.Ruay.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${security.jwt.secret_key}")
    private String jwtSecretKey;

    @Value("${security.jwt.issuer}")
    private String jwtIssuer;



    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;



    private String createJwtToken(User user) {
        Instant now = Instant.now();

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer(jwtIssuer)
                .issuedAt(now)
                .expiresAt(now.plusSeconds(24 * 3600))
                .subject(user.getUsername())
                .claim("role", user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(Collectors.joining(", ")))
                .build();

        var encoder = new NimbusJwtEncoder(
                new ImmutableSecret<>(jwtSecretKey.getBytes()));
        var params = JwtEncoderParameters.from(
          JwsHeader.with(MacAlgorithm.HS256).build(), claimsSet);

        return encoder.encode(params).getTokenValue();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@Valid @RequestBody SignUpDto signUpDto, BindingResult result) {



        if (result.hasErrors()) {
            var errorsList = result.getAllErrors();
            var errorsMap = new HashMap<String, String>();

            for (int i = 0; i < errorsList.size(); i++) {
                var error  = (FieldError) errorsList.get(i);
                errorsMap.put(error.getField(), error.getDefaultMessage());
            }

            return ResponseEntity.badRequest().body(errorsMap);
        }
        var bCryptEncoder = new BCryptPasswordEncoder();

        Role role = roleRepository.findByName(signUpDto.getRole())
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        User user = new User();
        user.setName(signUpDto.getName());
        user.setUsername(signUpDto.getUsername());
        user.setEmail(signUpDto.getEmail());
        user.setPassword(bCryptEncoder.encode(signUpDto.getPassword()));
        user.setRoles(Collections.singleton(role));

        try {
            if (userRepository.existsByUsername(signUpDto.getUsername())) {
                return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
            }

            if (userRepository.existsByEmail(signUpDto.getEmail())) {
                return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
            }

            userRepository.save(user);

            String jwtToken = createJwtToken(user);

            var response = new HashMap<String, Object>();
            response.put("token", jwtToken);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("error: ");
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().body("Error: User not created");

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto, BindingResult result){
        if (result.hasErrors()) {
            var errorsList = result.getAllErrors();
            var errorsMap = new HashMap<String, String>();

            for (int i = 0; i < errorsList.size(); i++) {
                var error  = (FieldError) errorsList.get(i);
                errorsMap.put(error.getField(), error.getDefaultMessage());
            }

            return ResponseEntity.badRequest().body(errorsMap);
        }

        try {

            User user = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String jwtToken = createJwtToken(user);

            var response = new HashMap<String, Object>();
            response.put("user", user);
            response.put("jwt", jwtToken);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            var response = new HashMap<String, String>();
            response.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

}





