package com.project1.controller.api;

import java.util.List;

import com.project1.dto.EmployeeDTO;
import com.project1.entities.data.Employee;
import com.project1.entities.data.Task;
import com.project1.repository.EmployeeRepository;
import com.project1.repository.TaskRepository;
import com.project1.repository.TaskToEmployeeRepository;
import com.project1.service.EmployeeService;
import com.project1.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import com.project1.dto.TaskDTO;

import com.project1.entities.data.TaskToEmployee;
import com.project1.service.TaskToEmployeeService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/public/task-to-employee/*")
@AllArgsConstructor
public class TaskToEmployeeController {

    private final TaskRepository taskRepository;

    private final EmployeeRepository employeeRepository;

    private final TaskToEmployeeService taskToEmployeeService;

    private final TaskToEmployeeRepository taskToEmployeeRepository;

    private final TaskService taskService;

    private final EmployeeService employeeService;

    @GetMapping("admin/find-all-task")
    public ResponseEntity<Object> findAllTask() {
        try {
            List<Task> tasks = taskRepository.findAllByDeletedFalseAndCompleteDateIsNull();
            return tasks != null ? ResponseEntity.ok(tasks) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("admin/find-all-employee")
    public ResponseEntity<Object> findAllEmployee() {
        try {
            List<Employee> employees = employeeRepository.findAllByDeletedFalse();
            return employees != null ? ResponseEntity.ok(employees) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("search-by-name")
    public ResponseEntity<Object> searchByName(@RequestParam(name = "tName", required = false) String tName,
                                               @RequestParam(name = "eName", required = false) String eName) {

        try {
            List<TaskDTO> taskDTOs = taskToEmployeeService.search(tName, eName);
            return taskDTOs != null ? ResponseEntity.ok(taskDTOs) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("search")
    public ResponseEntity<Object> search(@RequestParam(name = "status", required = false) Byte status,
                                         @RequestParam(name = "employeeId", required = false) Integer employeeId) {

        try {
            List<TaskToEmployee> taskToEmployees = taskToEmployeeService.search(status, employeeId);
            return taskToEmployees != null ? ResponseEntity.ok(taskToEmployees) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("admin/insert-to-task")
    public ResponseEntity<Object> insertToTask(Authentication authentication, @RequestBody TaskToEmployee taskToEmployee) {
        try {
            User user = (User) authentication.getPrincipal();
            TaskDTO dto = taskService.findById(taskToEmployeeService.insert(user.getUsername(), taskToEmployee).getTask().getId());
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("admin/insert-to-employee")
    public ResponseEntity<Object> insertToEmployee(Authentication authentication, @RequestBody TaskToEmployee taskToEmployee) {
        try {
            User user = (User) authentication.getPrincipal();
            EmployeeDTO dto = employeeService.findById(taskToEmployeeService.insert(user.getUsername(), taskToEmployee).getEmployee().getId());
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("admin/insert")
    public ResponseEntity<Object> insert(Authentication authentication, @RequestBody TaskToEmployee taskToEmployee) {
        try {
            User user = (User) authentication.getPrincipal();
            TaskToEmployee dto = taskToEmployeeService.insert(user.getUsername(), taskToEmployee);
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("admin/update-all")
    public ResponseEntity<Object> updateAll(Authentication authentication, @RequestBody List<TaskToEmployee> taskToEmployees) {
        try {
            User user = (User) authentication.getPrincipal();
            List<TaskToEmployee> dtos = taskToEmployeeService.updateAll(user.getUsername(), taskToEmployees);
            return dtos != null ? ResponseEntity.ok(dtos) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("update")
    public ResponseEntity<Object> update(Authentication authentication, @RequestBody TaskToEmployee taskToEmployee) {
        try {
            User user = (User) authentication.getPrincipal();
            TaskToEmployee dto = taskToEmployeeService.update(user.getUsername(), taskToEmployee);
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("admin/delete")
    public ResponseEntity<Object> delete(Authentication authentication, @RequestBody TaskToEmployee taskToEmployee) {
        try {
            User user = (User) authentication.getPrincipal();
            if (taskToEmployeeService.delete(user.getUsername(), taskToEmployee)) {
                return ResponseEntity.ok("Delete Successful");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("admin/pause")
    public ResponseEntity<Object> pause(Authentication authentication, @RequestBody TaskToEmployee taskToEmployee) {
        try {
            User user = (User) authentication.getPrincipal();

            if (taskToEmployeeService.pause(user.getUsername(), taskToEmployee)) {
                return ResponseEntity.ok(taskToEmployeeRepository.findByIdAndDeletedFalseAndPausedTrue(taskToEmployee.getId()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }
}
