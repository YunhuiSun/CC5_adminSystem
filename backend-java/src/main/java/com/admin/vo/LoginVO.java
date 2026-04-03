package com.admin.vo;

import lombok.Data;

import java.util.List;

@Data
public class LoginVO {
    private String token;
    private UserVO user;
}