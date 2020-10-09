package com.project1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project1.entities.data.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
	
	List<Task> findAllByDeletedFalse();

}
