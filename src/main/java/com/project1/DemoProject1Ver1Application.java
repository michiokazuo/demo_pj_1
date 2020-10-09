package com.project1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.Transactional;

import com.project1.repository.TaskRepository;
import com.project1.repository.TaskToEmployeeRepository;
import com.project1.service.TaskService;

import lombok.AllArgsConstructor;

@SpringBootApplication
@AllArgsConstructor
public class DemoProject1Ver1Application implements CommandLineRunner {

	private final TaskRepository taskRepository;
	
	private final TaskToEmployeeRepository taskToEmployeeRepository;

	private final TaskService taskService;

	public static void main(String[] args) {
		SpringApplication.run(DemoProject1Ver1Application.class, args);
	}

	@Override
	@Transactional
	public void run(String... args) throws Exception {
		taskService.findAll().forEach(System.out::println);
	}

}
