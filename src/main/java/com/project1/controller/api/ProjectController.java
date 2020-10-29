package com.project1.controller.api;

import com.project1.dto.ProjectDTO;
import com.project1.entities.data.Project;
import com.project1.service.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/public/project/*")
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("find-all")
    public ResponseEntity<Object> findAll() {

        try {
            List<ProjectDTO> projectDTOS = projectService.findAll();
            return projectDTOS != null ? ResponseEntity.ok(projectDTOS) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("find-by-id/{id}")
    public ResponseEntity<Object> findById(@PathVariable("id") Integer id) {

        try {
            ProjectDTO projectDTO = projectService.findById(id);
            return projectDTO != null ? ResponseEntity.ok(projectDTO) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("search-sort")
    public ResponseEntity<Object> search_sort(@RequestParam(name = "name", required = false) String name,
                                              @RequestParam(name = "createDate", required = false) Date createDate,
                                              @RequestParam(name = "status", required = false) Byte status,
                                              @RequestParam(name = "field", required = false) String field,
                                              @RequestParam(name = "isASC", required = false) Boolean isASC) {

        try {
            List<ProjectDTO> projectDTOS = projectService.search_sort(new ProjectDTO(Project.builder().name(name)
                    .createDate(createDate).build(), null), field, isASC, status);
            return projectDTOS != null ? ResponseEntity.ok(projectDTOS) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("insert")
    public ResponseEntity<Object> insert(@RequestBody ProjectDTO projectDTO) {
        try {
            ProjectDTO dto = projectService.insert(projectDTO);
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("update")
    public ResponseEntity<Object> update(@RequestBody ProjectDTO projectDTO) {
        try {
            ProjectDTO dto = projectService.insert(projectDTO);
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable("id") Integer id) {
        try {
            if (projectService.delete(id)) {
                return ResponseEntity.ok("Delete Successful");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.badRequest().build();
    }
}
