package com.project1.service;

import java.util.List;

import com.project1.dto.EmployeeDTO;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.project1.dto.TaskDTO;
import com.project1.entities.data.TaskToEmployee;

public interface TaskToEmployeeService {

	@Modifying
	@Transactional(rollbackFor = Exception.class)
	TaskDTO insertToTask(TaskToEmployee te) throws Exception;

	@Modifying
	@Transactional(rollbackFor = Exception.class)
	EmployeeDTO insertToEmployee(TaskToEmployee te) throws Exception;

	@Modifying
	@Transactional(rollbackFor = Exception.class)
	TaskToEmployee insert(TaskToEmployee te) throws Exception;

	@Modifying
	@Transactional(rollbackFor = Exception.class)
	boolean delete(TaskToEmployee te) throws Exception;

	List<TaskDTO> search(String taskName, String employeeName) throws Exception;

	List<TaskToEmployee> search(Byte status, Integer id_employee) throws Exception;

}
