package com.project1.dto;

import java.util.List;

import com.project1.entities.data.Task;
import com.project1.entities.data.TaskToEmployee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskDTO {

	private Task task;
	private List<TaskToEmployee> taskToEmployees;

}
