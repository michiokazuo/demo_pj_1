package com.project1.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.project1.entities.data.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

	List<Task> findAllByDeletedFalse();

	List<Task> findAllByDeletedFalseAndCompleteDateIsNull();

	Task findByIdAndDeletedFalse(Integer id);
	
	@Query("update Task t set t.deleted = true where t.id = ?1")
	@Modifying
	@Transactional
	int deleteCustom(Integer id);

}
