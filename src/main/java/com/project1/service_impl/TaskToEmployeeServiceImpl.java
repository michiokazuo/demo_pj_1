package com.project1.service_impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.project1.convert.Convert;
import com.project1.dto.EmployeeDTO;
import com.project1.service.EmployeeService;
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

    private final EmployeeService employeeService;

    private final TaskRepository taskRepository;

    private final EmployeeRepository employeeRepository;

    private final TaskToEmployeeRepository taskToEmployeeRepository;

    private final Convert<Task, TaskToEmployee, TaskDTO> convert;

    @Override
    public TaskDTO insertToTask(TaskToEmployee taskToEmployee) throws Exception {
        TaskDTO taskDTO = null;

        if (taskToEmployee != null) {
            Task task = taskRepository.findByIdAndDeletedFalse(taskToEmployee.getId().getTaskId());
            Employee employee = employeeRepository.findByIdAndDeletedFalse(taskToEmployee.getId().getEmployeeId());

            if (task != null && employee != null) {
                taskToEmployee.setEmployee(employee);
                taskToEmployee.setTask(task);
                taskToEmployee.setProgress(taskToEmployee.getProgress() == null ? 0 : taskToEmployee.getProgress());

                if (taskToEmployee.getTask().getCompleteDate() == null) { // task da hpan thanh ko dc sua
                    TaskToEmployee t = taskToEmployeeRepository.save(taskToEmployee);
                    taskDTO = taskService.findById(t.getId().getTaskId());
                }
            }
        }

        return taskDTO;
    }

    @Override
    public EmployeeDTO insertToEmployee(TaskToEmployee taskToEmployee) throws Exception {
        EmployeeDTO employeeDTO = null;

        if (taskToEmployee != null) {
            Task task = taskRepository.findByIdAndDeletedFalse(taskToEmployee.getId().getTaskId());
            Employee employee = employeeRepository.findByIdAndDeletedFalse(taskToEmployee.getId().getEmployeeId());

            if (task != null && employee != null) {
                taskToEmployee.setEmployee(employee);
                taskToEmployee.setTask(task);
                taskToEmployee.setProgress(taskToEmployee.getProgress() == null ? 0 : taskToEmployee.getProgress());

                if (taskToEmployee.getTask().getCompleteDate() == null) { // task da hpan thanh ko dc sua
                    TaskToEmployee t = taskToEmployeeRepository.save(taskToEmployee);
                    employeeDTO = employeeService.findById(t.getId().getTaskId());
                }
            }
        }

        return employeeDTO;
    }

    @Override
    public TaskToEmployee insert(TaskToEmployee taskToEmployee) throws Exception {
        if (taskToEmployee != null) {
            Task task = taskRepository.findByIdAndDeletedFalse(taskToEmployee.getId().getTaskId());
            Employee employee = employeeRepository.findByIdAndDeletedFalse(taskToEmployee.getId().getEmployeeId());

            if (task != null && employee != null) {
                taskToEmployee.setEmployee(employee);
                taskToEmployee.setTask(task);
                taskToEmployee.setProgress(taskToEmployee.getProgress() == null ? 0 : taskToEmployee.getProgress());

                if (taskToEmployee.getTask().getCompleteDate() == null) { // task da hpan thanh ko dc sua
                    return taskToEmployeeRepository.save(taskToEmployee);
                }
            }
        }
        return null;
    }

    @Override
    public boolean delete(TaskToEmployee taskToEmployee) throws Exception {
        return taskToEmployee != null
                && (taskToEmployeeRepository.deleteCustom(taskToEmployee.getId().getTaskId()
                , taskToEmployee.getId().getEmployeeId()) >= 0);
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

    @Override
    public List<TaskToEmployee> search(Byte status, Integer id_employee) throws Exception {
        long msDay = 24 * 60 * 60 * 1000;
        List<TaskToEmployee> taskToEmployees = taskToEmployeeRepository.findAll(Example.of(TaskToEmployee.builder()
                .task(Task.builder().build()).progress(null)
                .employee(employeeRepository.findByIdAndDeletedFalse(id_employee))
                .build()));

        return status == null ? taskToEmployees : taskToEmployees.stream().filter(te -> status > 0 ? te.getProgress() == 100 :
                status < 0 ? te.getProgress() != 100 && te.getTask().getEndDate().getTime() - new Date().getTime() <= -msDay
                        : te.getProgress() != 100 && te.getTask().getEndDate().getTime() - new Date().getTime() > -msDay)
                .collect(Collectors.toList());
    }
}
