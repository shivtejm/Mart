package com.example.RegisterPage.dto;

public class ProfileResponse {

    private String name;
    private String email;


    public ProfileResponse(String name, String email) {

        this.name = name;
        this.email = email;

    }


    public String getName() {
        return name;
    }


    public String getEmail() {
        return email;
    }

}