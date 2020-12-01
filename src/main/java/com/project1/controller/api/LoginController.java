package com.project1.controller.api;

import com.project1.dto.EmployeeDTO;
import com.project1.entities.data.Employee;
import com.project1.repository.EmployeeRepository;
import com.project1.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/login-process")
@AllArgsConstructor
public class LoginController {

    private final EmployeeRepository employeeRepository;

    @GetMapping("/success")
    public ResponseEntity<Employee> loginSuccess(Authentication authentication){
        Employee result = null;
        try {
            result = employeeRepository.findByEmailAndDeletedFalse(((User) authentication.getPrincipal()).getUsername());
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.badRequest().build();
    }

    @GetMapping("/fail")
    public ResponseEntity<Object> loginFail(){
        return ResponseEntity.badRequest().build();
    }
}
