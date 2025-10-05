package com.example.HomeAppliancesStore.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateUserRequest {

    @NotBlank(message = "Username không được để trống.")
    @Size(min = 3, max = 20, message = "Username phải có từ 3 đến 20 ký tự.")
    private String username;

    @NotBlank(message = "Password không được để trống.")
    @Size(min = 6, message = "Password phải có ít nhất 6 ký tự.")
    private String password;

    @NotNull(message = "Profile không được để trống.")
    private Long profileId;
    private String role;
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }
}
