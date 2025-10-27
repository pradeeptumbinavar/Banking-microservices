package com.banking.auth_service.security;

import com.banking.auth_service.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * UserDetails implementation for Spring Security authentication.
 * Wraps User entity with Spring Security's UserDetails interface.
 */
public class UserDetailsImpl implements UserDetails {
    
    private Long id;
    private String username;
    private String email;
    
    @JsonIgnore
    private String password;
    
    private String role;
    private boolean mfaEnabled;
    private String mfaSecret;
    private boolean accountNonLocked;
    private boolean enabled;
    
    private Collection<? extends GrantedAuthority> authorities;
    
    public UserDetailsImpl() {
    }
    
    public UserDetailsImpl(Long id, String username, String email, String password, 
                          String role, boolean mfaEnabled, String mfaSecret, 
                          boolean accountNonLocked, boolean enabled, 
                          Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.mfaEnabled = mfaEnabled;
        this.mfaSecret = mfaSecret;
        this.accountNonLocked = accountNonLocked;
        this.enabled = enabled;
        this.authorities = authorities;
    }
    
    /**
     * Build UserDetailsImpl from User entity.
     */
    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority(user.getRole().name())
        );
        
        return new UserDetailsImpl(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            user.getRole().name(),
            user.isMfaEnabled(),
            user.getMfaSecret(),
            user.isAccountNonLocked(),
            user.isEnabled(),
            authorities
        );
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public boolean isMfaEnabled() {
        return mfaEnabled;
    }
    
    public void setMfaEnabled(boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }
    
    public String getMfaSecret() {
        return mfaSecret;
    }
    
    public void setMfaSecret(String mfaSecret) {
        this.mfaSecret = mfaSecret;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public void setAccountNonLocked(boolean accountNonLocked) {
        this.accountNonLocked = accountNonLocked;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
    }
}
