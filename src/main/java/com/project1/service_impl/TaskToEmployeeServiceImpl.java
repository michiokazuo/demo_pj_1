package com.project1.service_impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.project1.config.AppConfig;
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
import com.project1.service.TaskToEmployeeService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TaskToEmployeeServiceImpl implements TaskToEmployeeService {

    private final TaskRepository taskRepository;

    private final EmployeeRepository employeeRepository;

    private final TaskToEmployeeRepository taskToEmployeeRepository;

    private final Convert<Task, TaskToEmployee, TaskDTO> convert;

    @Override
    public TaskToEmployee insert(String email, TaskToEmployee taskToEmployee) throws Exception {
        TaskToEmployee rs = null;
        if (taskToEmployee != null) {
            if (taskToEmployeeRepository.findByIdAndDeletedFalseAndPausedFalse(taskToEmployee.getId()) != null)
                return null;
            Task task = taskRepository.findByIdAndDeletedFalse(taskToEmployee.getId().getTaskId());
            Employee employee = employeeRepository.findByIdAndDeletedFalse(taskToEmployee.getId().getEmployeeId());

            if (task != null && employee != null && !employee.getRole().getId().equals(AppConfig.roles.get(AppConfig.ADMIN).getId())) {
                if (taskToEmployee.getTask().getCompleteDate() == null) { // task da hoan thanh ko dc sua
                    taskToEmployee.setEmployee(employee);
                    taskToEmployee.setTask(task);
                    taskToEmployee.setProgress(0);
                    taskToEmployee.setDeleted(false);
                    taskToEmployee.setPaused(false);
                    taskToEmployee.setModifyDate(new Date());
                    taskToEmployee.setModifyBy(employeeRepository.findByEmailAndDeletedFalse(email));

                    rs = taskToEmployeeRepository.save(taskToEmployee);
                }
            }
        }
        return rs;
    }

    @Override
    public TaskToEmployee update(String email, TaskToEmployee taskToEmployee) throws Exception {
        if (taskToEmployee != null) {
            TaskToEmployee te = taskToEmployeeRepository.findByIdAndDeletedFalse(taskToEmployee.getId());

            if (te == null || te.getPaused() || te.getTask().getCompleteDate() != null
                    || te.getEmployee().getRole().getId().equals(AppConfig.roles.get(AppConfig.ADMIN).getId()))
                return null;

            taskToEmployee.setEmployee(te.getEmployee());
            taskToEmployee.setTask(te.getTask());
            Integer progress = taskToEmployee.getProgress();
            taskToEmployee.setProgress((progress == null || progress < 0 || progress > 100)
                    ? taskToEmployeeRepository.findByIdAndDeletedFalse(taskToEmployee.getId()).getProgress()
                    : taskToEmployee.getProgress());
            taskToEmployee.setDeleted(false);
            taskToEmployee.setPaused(false);
            taskToEmployee.setModifyDate(new Date());
            taskToEmployee.setModifyBy(employeeRepository.findByEmailAndDeletedFalse(email));

            return taskToEmployeeRepository.save(taskToEmployee);
        }
        return null;
    }

    @Override
    public List<TaskToEmployee> updateAll(String email, List<TaskToEmployee> taskToEmployees) throws Exception {
        if (taskToEmployees != null) {
            for (TaskToEmployee taskToEmployee : taskToEmployees)
                if (taskToEmployee != null) {
                    TaskToEmployee te = taskToEmployeeRepository.findByIdAndDeletedFalse(taskToEmployee.getId());

                    if (te == null || te.getTask().getCompleteDate() != null
                            || te.getEmployee().getRole().getId().equals(AppConfig.roles.get(AppConfig.ADMIN).getId())) {
                        return null;
                    }

                    if (te.getPaused())
                        continue;

                    taskToEmployee.setEmployee(te.getEmployee());
                    taskToEmployee.setTask(te.getTask());
                    taskToEmployee.setDeleted(false);
                    taskToEmployee.setPaused(false);
                    Integer progress = taskToEmployee.getProgress();
                    taskToEmployee.setProgress((progress == null || progress < 0 || progress > 100)
                            ? taskToEmployeeRepository.findByIdAndDeletedFalse(taskToEmployee.getId()).getProgress()
                            : taskToEmployee.getProgress());
                }
            return taskToEmployeeRepository.saveAll(taskToEmployees);
        }
        return null;
    }

    @Override
    public boolean delete(String email, TaskToEmployee taskToEmployee) throws Exception {
        if (taskToEmployee != null
                && taskToEmployeeRepository.findByIdAndDeletedFalse(taskToEmployee.getId()).getProgress() != 0)
            return false;
        return taskToEmployee != null
                && (taskToEmployeeRepository.deleteCustom(employeeRepository.findByEmailAndDeletedFalse(email)
                , taskToEmployee.getId().getTaskId(), taskToEmployee.getId().getEmployeeId()) >= 0);
    }

    @Override
    public boolean pause(String email, TaskToEmployee taskToEmployee) throws Exception {
        return taskToEmployee != null
                && (taskToEmployeeRepository.pauseCustom(employeeRepository.findByEmailAndDeletedFalse(email)
                , taskToEmployee.getId().getTaskId(), taskToEmployee.getId().getEmployeeId()) >= 0);
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
