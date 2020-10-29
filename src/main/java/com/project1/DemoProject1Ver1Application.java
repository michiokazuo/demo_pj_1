package com.project1;

import com.project1.repository.EmployeeRepository;
import com.project1.repository.RoleRepository;
import com.project1.repository.TaskRepository;
import com.project1.repository.TaskToEmployeeRepository;
import com.project1.service.ProjectService;
import com.project1.service.TaskService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;

import java.util.Arrays;

@SpringBootApplication
@AllArgsConstructor
public class DemoProject1Ver1Application implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;

    public static void main(String[] args) {
        SpringApplication.run(DemoProject1Ver1Application.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

    }

}
