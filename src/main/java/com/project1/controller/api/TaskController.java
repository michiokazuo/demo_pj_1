package com.project1.controller.api;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project1.repository.TaskRepository;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/public/task/*")
@AllArgsConstructor
public class TaskController {
	
	private final TaskRepository taskRepository;
	
	@GetMapping("find-all")
	@Transactional
	public ResponseEntity<Object> findAll(){
		return ResponseEntity.ok(taskRepository.findAll());
	}

}
