package com.project1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project1.entities.data.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer>{

}
