package com.project1.service_impl;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

import org.springframework.stereotype.Service;

import com.project1.dto.TaskDTO;
import com.project1.entities.data.Employee;
import com.project1.entities.data.Task;
import com.project1.entities.data.TaskToEmployee;
import com.project1.repository.TaskRepository;
import com.project1.repository.TaskToEmployeeRepository;
import com.project1.service.TaskService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class TaskServiceImpl implements TaskService {

	private final TaskRepository taskRepository;

	private final TaskToEmployeeRepository taskToEmployeeRepository;

	@Override
	public List<TaskDTO> findAll() {
		List<TaskDTO> taskDTOs = new ArrayList<TaskDTO>();
		List<Task> tasks = taskRepository.findAllByDeletedFalse();
		List<TaskToEmployee> taskToEmployees = taskToEmployeeRepository.findAllByDeletedFalse();

		int i = 0;
		ListIterator<TaskToEmployee> listIterator = null;

		for (Task t : tasks) {
			taskDTOs.add(new TaskDTO(t, new ArrayList<Employee>()));

			listIterator = taskToEmployees.listIterator();
			while (listIterator.hasNext()) {
				TaskToEmployee taskToEmployee = listIterator.next();

				if (t.getId().equals(taskToEmployee.getTask().getId())) {
					taskDTOs.get(i).getEmployees().add(taskToEmployee.getEmployee());
					listIterator.remove();
				}

			}

			if (taskDTOs.get(i).getEmployees().isEmpty()) {
				taskDTOs.get(i).setEmployees(null);
			}

			i++;
		}

		return taskDTOs.size() > 0 ? taskDTOs : null;
	}

}
