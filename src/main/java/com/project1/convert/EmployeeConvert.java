package com.project1.convert;

import com.project1.dto.EmployeeDTO;
import com.project1.entities.data.Employee;
import com.project1.entities.data.TaskToEmployee;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

@Service
public class EmployeeConvert implements Convert<Employee, TaskToEmployee, EmployeeDTO>{
    @Override
    public List<EmployeeDTO> toDTO(List<Employee> m1, List<TaskToEmployee> m2) throws Exception {
        List<EmployeeDTO> employeeDTOs = new ArrayList<EmployeeDTO>();
        ListIterator<TaskToEmployee> listIterator = null;

        for (Employee e : m1) {
            EmployeeDTO employeeDTO = new EmployeeDTO(e, new ArrayList<TaskToEmployee>());

            listIterator = m2.listIterator();
            while (listIterator.hasNext()) {
                TaskToEmployee taskToEmployee = listIterator.next();

                if (e.getId().equals(taskToEmployee.getEmployee().getId())) {
                    taskToEmployee.setEmployee(null);
                    employeeDTO.getTaskToEmployees().add(taskToEmployee);
                    listIterator.remove();
                }

            }

            if (employeeDTO.getTaskToEmployees().isEmpty()) {
                employeeDTO.setTaskToEmployees(null);
            }

            employeeDTOs.add(employeeDTO);
        }

        return employeeDTOs.size() > 0 ? employeeDTOs : null;
    }
}
