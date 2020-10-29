package com.project1.repository;

import com.project1.entities.data.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {

    List<Project> findAllByDeletedFalse();

    Project findByIdAndDeletedFalse(Integer id);

    @Query("update Project p set p.deleted = true where p.id = ?1")
    @Modifying
    @Transactional
    int deleteCustom(Integer id);
}
