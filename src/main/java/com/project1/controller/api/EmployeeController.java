package com.project1.controller.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
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

    @GetMapping("find-all")
    public ResponseEntity<Object> findAll() {

        try {
            List<EmployeeDTO> employeeDTOs = employeeService.findAll();
            return employeeDTOs != null ? ResponseEntity.ok(employeeDTOs) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("find-by-id/{id}")
    public ResponseEntity<Object> findById(@PathVariable("id") Integer id) {

        try {
            EmployeeDTO EmployeeDTO = employeeService.findById(id);
            return EmployeeDTO != null ? ResponseEntity.ok(EmployeeDTO) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("search-sort")
    public ResponseEntity<Object> search_sort(@RequestParam(name = "name", required = false) String name,
                                              @RequestParam(name = "position", required = false) String position,
                                              @RequestParam(name = "field", required = false) String field,
                                              @RequestParam(name = "isASC", required = false) Boolean isASC) {

        try {
            List<EmployeeDTO> employeeDTOs = employeeService.search_sort(
                    new EmployeeDTO(Employee.builder().name(name).position(position).build(), null), field,
                    isASC, null);
            return employeeDTOs != null ? ResponseEntity.ok(employeeDTOs) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("insert")
    public ResponseEntity<Object> insert(@RequestBody EmployeeDTO employeeDTO) {
        try {
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

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id) {

        try {
            if (employeeService.delete(id)) {
                return ResponseEntity.ok("Delete Successful");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }

}
