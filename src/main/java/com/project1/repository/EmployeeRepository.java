package com.project1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.project1.entities.data.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

	List<Employee> findAllByDeletedFalse();

	Employee findByIdAndDeletedFalse(Integer id);

	@Query("update Employee e set e.deleted = true where e.id = ?1")
	@Modifying
	@Transactional
	int deleteCustom(Integer id);

}
