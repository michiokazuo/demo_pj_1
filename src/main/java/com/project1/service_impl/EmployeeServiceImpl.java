package com.project1.service_impl;

import java.util.ArrayList;
import java.util.List;

import com.project1.config.AppConfig;
import com.project1.convert.Convert;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.project1.dto.EmployeeDTO;
import com.project1.entities.data.Employee;
import com.project1.entities.data.TaskToEmployee;
import com.project1.repository.EmployeeRepository;
import com.project1.repository.TaskToEmployeeRepository;
import com.project1.service.EmployeeService;
import com.project1.service.TaskToEmployeeService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final TaskToEmployeeRepository taskToEmployeeRepository;

    private final Convert<Employee, TaskToEmployee, EmployeeDTO> convert;

    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public List<EmployeeDTO> findAll() throws Exception {
        List<Employee> employees = employeeRepository.findAllByDeletedFalseAndRole_Id(AppConfig.roles.get(AppConfig.USER).getId());
        List<TaskToEmployee> taskToEmployees = taskToEmployeeRepository.findAllByDeletedFalse();

        return convert.toDTO(employees, taskToEmployees);
    }

    @Override
    public EmployeeDTO findById(Integer id) throws Exception {
        if (id == null || id < 0)
            return null;
        else {
            Employee employee = employeeRepository.findByIdAndDeletedFalse(id);
            List<TaskToEmployee> taskToEmployees = taskToEmployeeRepository
                    .findByEmployeeIdAndDeletedFalse(employee.getId());

            EmployeeDTO employeeDTO = new EmployeeDTO(employee, new ArrayList<>());

            for (TaskToEmployee t : taskToEmployees) {
                employeeDTO.getTaskToEmployees().add(t);
            }

            if (employeeDTO.getTaskToEmployees().isEmpty()) {
                employeeDTO.setTaskToEmployees(null);
            }

            return employeeDTO;
        }
    }

    @Override
    public List<EmployeeDTO> search_sort(EmployeeDTO employeeDTO, String field, Boolean isASC, Byte status)
            throws Exception {
        Employee employee = new Employee();
        if (employeeDTO != null && employeeDTO.getEmployee() != null) {
            employee = employeeDTO.getEmployee();
            employee.setDeleted(false);
        }

        List<Employee> employees = (field != null && isASC != null)
                ? employeeRepository.findAll(
                Example.of(employee, ExampleMatcher.matchingAll()
                        .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)),
                Sort.by(isASC ? Sort.Direction.ASC : Sort.Direction.DESC, field))
                : employeeRepository.findAll(Example.of(employee, ExampleMatcher.matchingAll()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)));

        List<Integer> ids = new ArrayList<>();
        for (Employee e : employees) {
            ids.add(e.getId());
        }

        return convert.toDTO(employees, taskToEmployeeRepository.findByEmployeeIdInAndDeletedFalse(ids));
    }

    @Override
    public EmployeeDTO insert(EmployeeDTO employeeDTO) throws Exception {
        if (employeeDTO == null || employeeDTO.getEmployee() == null
                || employeeRepository.existsByEmailOrPhoneAndDeletedFalse(employeeDTO.getEmployee().getEmail()
                , employeeDTO.getEmployee().getPhone())) return null;

        Employee employee = employeeDTO.getEmployee();
        employee.setDeleted(false);
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        return findById(employeeRepository.save(employee).getId());
    }

    @Override
    public EmployeeDTO update(EmployeeDTO employeeDTO) throws Exception {
        if (employeeDTO != null && employeeDTO.getEmployee() != null) {
            Employee employee = employeeDTO.getEmployee();
            Employee employeeDB = employeeRepository.findByIdAndDeletedFalse(employee.getId());
            List<Employee> employeeList = employeeRepository.findByEmailOrPhoneAndDeletedFalse(employee.getEmail()
                    , employee.getPhone());
            if (employeeDB == null) return null;

            if (employeeDB.getEmail().equals(employee.getEmail()) || employeeDB.getPhone().equals(employee.getPhone())) {
                if (employeeList != null && employeeList.size() > 1) return null;
            } else {
                if (employeeList != null) return null;
            }

            employee.setDeleted(false);
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
            return findById(employeeRepository.save(employee).getId());
        }

        return null;
    }

    @Override
    public boolean delete(String email, Integer id) throws Exception {
        return id != null && id > 0 && (employeeRepository.deleteCustom(id) >= 0
                && taskToEmployeeRepository
                .deleteCustomByEmployeeId(employeeRepository.findByEmailAndDeletedFalse(email), id) >= 0);
    }
}
