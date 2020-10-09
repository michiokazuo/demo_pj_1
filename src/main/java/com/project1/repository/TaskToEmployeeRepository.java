package com.project1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project1.entities.data.TaskToEmployee;
import com.project1.entities.key.TaskToEmployeePK;

@Repository
public interface TaskToEmployeeRepository extends JpaRepository<TaskToEmployee, TaskToEmployeePK>{
	
	List<TaskToEmployee> findAllByDeletedFalse();

}
