package org.example.apigateway.service;

import org.example.apigateway.entity.User;

public interface UserService {
    User saveUser(String email);
    User findByEmail(String email);
}