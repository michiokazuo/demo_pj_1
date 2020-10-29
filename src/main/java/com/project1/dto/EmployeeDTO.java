package com.project1.dto;

import java.util.List;

import com.project1.entities.data.Employee;
import com.project1.entities.data.TaskToEmployee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {

	private Employee employee;
	private List<TaskToEmployee> taskToEmployees;
}
