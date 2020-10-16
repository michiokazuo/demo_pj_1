package com.project1;

import com.project1.dto.TaskDTO;
import com.project1.entities.data.Task;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.Transactional;

import com.project1.entities.data.TaskToEmployee;
import com.project1.entities.key.TaskToEmployeePK;
import com.project1.repository.EmployeeRepository;
import com.project1.repository.TaskRepository;
import com.project1.repository.TaskToEmployeeRepository;
import com.project1.service.TaskService;

import lombok.AllArgsConstructor;

import java.util.Date;

@SpringBootApplication
@AllArgsConstructor
public class DemoProject1Ver1Application implements CommandLineRunner {

    private final TaskRepository taskRepository;

    private final EmployeeRepository employeeRepository;

    private final TaskToEmployeeRepository taskToEmployeeRepository;

    private final TaskService taskService;

    public static void main(String[] args) {
        SpringApplication.run(DemoProject1Ver1Application.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
//        System.out.println(taskToEmployeeRepository.deleteCustomByTaskId(5));
    }

}
