package com.project1.repository;

import java.util.List;

import com.project1.entities.data.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.project1.entities.data.TaskToEmployee;
import com.project1.entities.key.TaskToEmployeePK;

public interface TaskToEmployeeRepository extends JpaRepository<TaskToEmployee, TaskToEmployeePK> {

    List<TaskToEmployee> findAllByDeletedFalse();

    TaskToEmployee findByIdAndDeletedFalse(TaskToEmployeePK id);

    TaskToEmployee findByIdAndDeletedFalseAndPausedFalse(TaskToEmployeePK id);

    TaskToEmployee findByIdAndDeletedFalseAndPausedTrue(TaskToEmployeePK id);

    List<TaskToEmployee> findByTaskIdAndDeletedFalse(Integer task_id);

    List<TaskToEmployee> findByEmployeeIdAndDeletedFalse(Integer employee_id);

    List<TaskToEmployee> findByEmployeeIdInAndDeletedFalse(List<Integer> integers);

    List<TaskToEmployee> findByTaskIdInAndDeletedFalse(List<Integer> integers);

    @Query("update TaskToEmployee t set t.deleted = true, t.modifyBy = ?1 where t.id.taskId = ?2")
    @Modifying
    @Transactional
    int deleteCustomByTaskId(Employee employee, Integer id);

    @Query("update TaskToEmployee t set t.deleted = true, t.modifyBy = ?1 where t.id.taskId in ?2")
    @Modifying
    @Transactional
    int deleteCustomByTaskIdIn(Employee employee, List<Integer> integers);

    @Query("update TaskToEmployee t set t.deleted = true, t.modifyBy = ?1 where t.id.employeeId = ?2")
    @Modifying
    @Transactional
    int deleteCustomByEmployeeId(Employee employee, Integer id);

    @Query("update TaskToEmployee t set t.deleted = true, t.modifyBy = ?1 where t.id.taskId = ?2 and t.id.employeeId = ?3")
    @Modifying
    @Transactional
    int deleteCustom(Employee employee, Integer taskId, Integer employeeId);

    @Query("update TaskToEmployee t set t.paused = true, t.progress = 100, t.modifyDate = current_date, t.modifyBy = ?1 where t.id.taskId = ?2 and t.id.employeeId = ?3")
    @Modifying
    @Transactional
    int pauseCustom(Employee employee, Integer taskId, Integer employeeId);

}
