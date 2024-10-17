package com.ruaymak3.Ruay.dto;

import lombok.Data;

@Data
public class LoginDto {
    private String usernameOrEmail;
    private String password;

}