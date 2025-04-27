package org.example.apigateway.service.impl;

import org.example.apigateway.entity.User;
import org.example.apigateway.repository.UserRepository;
import org.example.apigateway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public User saveUser(String email) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            User user = new User(email);
            System.out.println("Saving new user with email: " + email);
            return userRepository.save(user);
        }
        System.out.println("User with email " + email + " already exists.");
        return existingUser;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}