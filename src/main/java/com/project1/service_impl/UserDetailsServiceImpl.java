package com.project1.service_impl;

import com.project1.entities.data.Employee;
import com.project1.repository.EmployeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findByEmailAndDeletedFalse(username);

        if (employee == null) {
            throw new UsernameNotFoundException("Tài khoản " + username + " không tìm thấy!");
        }

        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(employee.getRole().getName());
        List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
        grantedAuthorityList.add(grantedAuthority);

        return new User(username, employee.getPassword(), grantedAuthorityList);
    }
}
