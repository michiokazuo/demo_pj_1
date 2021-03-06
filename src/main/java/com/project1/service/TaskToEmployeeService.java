package com.project1.service;

import java.util.List;

import com.project1.dto.EmployeeDTO;
import com.project1.entities.data.Employee;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.project1.dto.TaskDTO;
import com.project1.entities.data.TaskToEmployee;

public interface TaskToEmployeeService {
    TaskToEmployee insert(String email, TaskToEmployee te) throws Exception;

    @Modifying
    @Transactional(rollbackFor = Exception.class)
    TaskToEmployee update(String email, TaskToEmployee te) throws Exception;

    @Modifying
    @Transactional(rollbackFor = Exception.class)
    List<TaskToEmployee> updateAll(String email, List<TaskToEmployee> tes) throws Exception;

    @Modifying
    @Transactional(rollbackFor = Exception.class)
    boolean delete(String email, TaskToEmployee te) throws Exception;

    @Modifying
    @Transactional(rollbackFor = Exception.class)
    boolean pause(String email, TaskToEmployee te) throws Exception;

    List<TaskDTO> search(String taskName, String employeeName) throws Exception;

    List<TaskToEmployee> search(Byte status, Integer id_employee) throws Exception;

}
