package com.puzzlebox.model;

public class User {
    private String id;
    private String name;
    private String password;
    private String email;
    private Boolean isRegistered;

    public User() {}

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.isRegistered = false; //Default to false until email is verified
    }
    //Getters and Setters
    public String getEmail() { return email;}
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() { return password;}
    
    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() { return name;}

    public void setName(String name) {
        this.name = name;
    }


}