package com.project1.controller.api;

import java.util.List;

import com.project1.config.AppConfig;
import com.project1.repository.EmployeeRepository;
import com.project1.repository.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import com.project1.dto.EmployeeDTO;
import com.project1.entities.data.Employee;
import com.project1.service.EmployeeService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/public/employee/*")
@AllArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    private final EmployeeRepository employeeRepository;

    @GetMapping("admin/find-all")
    public ResponseEntity<Object> findAll() {
        try {
            List<EmployeeDTO> employeeDTOs = employeeService.findAll();
            return employeeDTOs != null ? ResponseEntity.ok(employeeDTOs) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(value = {"find-by-id/{id}", "find-by-id"})
    public ResponseEntity<Object> findById(Authentication authentication
            , @PathVariable(name = "id", required = false) Integer id) {

        try {
            User user = (User) authentication.getPrincipal();

            EmployeeDTO employeeDTO = employeeService
                    .findById(id == null ? employeeRepository.findByEmailAndDeletedFalse(user.getUsername()).getId() : id);
            return employeeDTO != null ? ResponseEntity.ok(employeeDTO) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("admin/search-sort")
    public ResponseEntity<Object> search_sort(@RequestParam(name = "name", required = false) String name,
                                              @RequestParam(name = "field", required = false) String field,
                                              @RequestParam(name = "isASC", required = false) Boolean isASC) {

        try {
            List<EmployeeDTO> employeeDTOs = employeeService.search_sort(
                    new EmployeeDTO(Employee.builder().name(name).build(), null)
                    , field, isASC, null);
            return employeeDTOs != null ? ResponseEntity.ok(employeeDTOs) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("insert")
    public ResponseEntity<Object> insert(@RequestBody EmployeeDTO employeeDTO) {
        try {
            employeeDTO.getEmployee().setRole(AppConfig.roles.get(AppConfig.USER));
            EmployeeDTO dto = employeeService.insert(employeeDTO);
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("update")
    public ResponseEntity<Object> update(@RequestBody EmployeeDTO employeeDTO) {
        try {
            // In employeeDTO if update progress then taskToEmployees has only one taskToEmployee
            EmployeeDTO dto = employeeService.update(employeeDTO);
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("admin/delete/{id}")
    public ResponseEntity<Object> delete(Authentication authentication, @PathVariable("id") Integer id) {

        try {
            User user = (User) authentication.getPrincipal();
            if (employeeService.delete(user.getUsername(), id)) {
                return ResponseEntity.ok("Delete Successful");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }
}
