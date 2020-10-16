package com.project1.service;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.project1.dto.TaskDTO;
import com.project1.entities.data.TaskToEmployee;

public interface TaskToEmployeeService {

	@Modifying
	@Transactional(rollbackFor = Exception.class)
	TaskDTO insert(TaskToEmployee employee) throws Exception;

	@Modifying
	@Transactional(rollbackFor = Exception.class)
	boolean delete(TaskToEmployee employee) throws Exception;

	List<TaskDTO> search(String taskName, String employeeName) throws Exception;

}
