package com.puzzlebox.controller;

import com.puzzlebox.model.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")

public class UserController {
    @PostMapping("/register")
    public String registerUser(@RequestBody User newUser) {
        //Call Database.queryExistingUser(newUser.getEmail()) to check if email is already registered
        System.out.println("Checking database for: " + newUser.getEmail());

        //Save user to database
        System.out.println("Saving new user: " + newUser.getEmail());
        //Send verification email
        System.out.println("Sending verification email to: " + newUser.getEmail());
        return "Register success! Please check your email to verify your account.";

    }

    //This matches the - enterLogin() method from your UIController
    @PostMapping("/login")
    public String loginUser(@RequestBody User loginUser) {
        // Query database to verify password matches
        System.out.println("Attempting login for: " + loginAttempt.getEmail());

        return "Login Success!";
}
