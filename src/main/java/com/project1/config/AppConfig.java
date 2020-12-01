package com.project1.config;

import com.project1.entities.data.Role;
import com.project1.repository.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Component
public class AppConfig {
    @Autowired
    private RoleRepository roleRepository;

    @Value("${role.admin}")
    private String adminRole;

    @Value("${role.user}")
    private String userRole;

    public static final String ADMIN = "admin";

    public static final String USER = "user";

    public static HashMap<String, Role> roles = new HashMap<>();

    @Value("${role.admin}")
    private void setAdminRole(String adminRole) {
        List<Role> roleList = roleRepository.findAll();
        for (Role role : roleList) {
            if (role.getName().equals(adminRole))
                roles.put("admin", role);
            if (role.getName().equals(userRole))
                roles.put("user", role);
        }
    }
}
