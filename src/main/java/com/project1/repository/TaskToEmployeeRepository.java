package com.project1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.project1.entities.data.TaskToEmployee;
import com.project1.entities.key.TaskToEmployeePK;
public interface TaskToEmployeeRepository extends JpaRepository<TaskToEmployee, TaskToEmployeePK> {

	List<TaskToEmployee> findAllByDeletedFalse();

	TaskToEmployee findByIdAndDeletedFalse(TaskToEmployeePK id);

	List<TaskToEmployee> findByTaskIdAndDeletedFalse(Integer task_id);

	List<TaskToEmployee> findByEmployeeIdAndDeletedFalse(Integer employee_id);

	List<TaskToEmployee> findByEmployeeIdInAndDeletedFalse(List<Integer> integers);

	List<TaskToEmployee> findByTaskIdInAndDeletedFalse(List<Integer> integers);

	@Query("update TaskToEmployee t set t.deleted = true where t.id.taskId = ?1")
	@Modifying
	@Transactional
	int deleteCustomByTaskId(Integer id);

	@Query("update TaskToEmployee t set t.deleted = true where t.id.taskId in ?1")
	@Modifying
	@Transactional
	int deleteCustomByTaskIdIn(List<Integer> integers);

	@Query("update TaskToEmployee t set t.deleted = true where t.id.employeeId = ?1")
	@Modifying
	@Transactional
	int deleteCustomByEmployeeId(Integer id);

	@Query("update TaskToEmployee t set t.deleted = true where t.id.taskId = ?1 and t.id.employeeId = ?2")
	@Modifying
	@Transactional
	int deleteCustom(Integer taskId, Integer employeeId);

}
