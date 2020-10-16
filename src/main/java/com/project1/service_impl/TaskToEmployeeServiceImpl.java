package com.project1.service_impl;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

import com.project1.convert.Convert;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import com.project1.dto.TaskDTO;
import com.project1.entities.data.Employee;
import com.project1.entities.data.Task;
import com.project1.entities.data.TaskToEmployee;
import com.project1.repository.EmployeeRepository;
import com.project1.repository.TaskRepository;
import com.project1.repository.TaskToEmployeeRepository;
import com.project1.service.TaskService;
import com.project1.service.TaskToEmployeeService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TaskToEmployeeServiceImpl implements TaskToEmployeeService {

    private final TaskService taskService;

    private final TaskRepository taskRepository;

    private final EmployeeRepository employeeRepository;

    private final TaskToEmployeeRepository taskToEmployeeRepository;

    private final Convert<Task, TaskToEmployee, TaskDTO> convert;

    @Override
    public TaskDTO insert(TaskToEmployee t) throws Exception {
        TaskDTO taskDTO = null;

        if (t != null) {
            Task task = taskRepository.findByIdAndDeletedFalse(t.getId().getTaskId());
            Employee employee = employeeRepository.findByIdAndDeletedFalse(t.getId().getEmployeeId());

            if (task != null && employee != null) {
                t.setEmployee(employee);
                t.setTask(task);
                t.setProgress(t.getProgress() == null ? 0 : t.getProgress());

                TaskToEmployee taskToEmployee = taskToEmployeeRepository.save(t);

                taskDTO = taskService.findById(taskToEmployee.getId().getTaskId());
            }
        }

        return taskDTO;
    }

    @Override
    public boolean delete(TaskToEmployee t) throws Exception {
        return t != null && (taskToEmployeeRepository.deleteCustom(t.getId().getTaskId(), t.getId().getEmployeeId()) >= 0);
    }

    @Override
    public List<TaskDTO> search(String tName, String eName) throws Exception {
        List<Task> tasks = taskRepository.findAll(Example.of(Task.builder().name(tName).build(),
                ExampleMatcher.matchingAll().withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)));
        List<Employee> employees = employeeRepository.findAll(Example.of(Employee.builder().name(eName).build(),
                ExampleMatcher.matchingAll().withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)));

        List<Integer> ids = new ArrayList<>();

        for (Employee e : employees) {
            ids.add(e.getId());
        }

        return convert.toDTO(tasks, taskToEmployeeRepository.findByEmployeeIdInAndDeletedFalse(ids));
    }

}
