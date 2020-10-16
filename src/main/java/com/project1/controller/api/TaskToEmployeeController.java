package com.project1.controller.api;

import java.util.List;

import com.project1.entities.data.Employee;
import com.project1.entities.data.Task;
import com.project1.repository.EmployeeRepository;
import com.project1.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("find-all-task")
    public ResponseEntity<Object> findAllTask() {
        try {
            List<Task> tasks = taskRepository.findAllByDeletedFalseAndCompleteDateIsNull();
            return tasks != null ? ResponseEntity.ok(tasks) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("find-all-employee")
    public ResponseEntity<Object> findAllEmployee() {
        try {
            List<Employee> employees = employeeRepository.findAllByDeletedFalse();
            return employees != null ? ResponseEntity.ok(employees) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("search")
    public ResponseEntity<Object> search(@RequestParam(name = "tName", required = false) String tName,
                                         @RequestParam(name = "eName", required = false) String eName) {

        try {
            List<TaskDTO> taskDTOs = taskToEmployeeService.search(tName, eName);
            return taskDTOs != null ? ResponseEntity.ok(taskDTOs) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("insert")
    public ResponseEntity<Object> insert(@RequestBody TaskToEmployee taskToEmployee) {
        try {
            TaskDTO dto = taskToEmployeeService.insert(taskToEmployee);
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("delete")
    public ResponseEntity<Object> delete(@RequestBody TaskToEmployee taskToEmployee) {
        try {
            if (taskToEmployeeService.delete(taskToEmployee)) {
                return ResponseEntity.ok("Delete Successful");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }
}
