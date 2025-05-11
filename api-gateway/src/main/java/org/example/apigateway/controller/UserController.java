package org.example.apigateway.controller;

import org.example.apigateway.entity.User;
import org.example.apigateway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public ResponseEntity<User> getUser(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");

        User user = userService.findByEmail(email);

        if (user == null) {
            user = userService.saveUser(email);
        }

        return ResponseEntity.ok(user);
    }
    //obtinem token ul pt a face cererea
    //fac cererea, primesc statusul si verific, daca statusu e 201 => il salvez in DB, daca e alt status => nu l salvez.

}