package com.project1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.project1.entities.data.Task;

public interface TaskRepository extends JpaRepository<Task, Integer> {

	List<Task> findAllByDeletedFalse();

	List<Task> findAllByDeletedFalseAndCompleteDateIsNull();

	Task findByIdAndDeletedFalse(Integer id);

	List<Task> findByProjectIdAndDeletedFalse(Integer project_id);

	List<Task> findByProjectIdInAndDeletedFalse(List<Integer> integers);

	@Query("update Task t set t.deleted = true where t.id = ?1")
	@Modifying
	@Transactional
	int deleteCustom(Integer id);

	@Query("update Task t set t.deleted = true where t.project.id = ?1")
	@Modifying
	@Transactional
	int deleteCustomByProjectId(Integer project_id);

}
