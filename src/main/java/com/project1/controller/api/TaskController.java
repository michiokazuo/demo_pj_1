package com.project1.controller.api;

import java.util.Date;
import java.util.List;

import com.project1.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import com.project1.dto.TaskDTO;
import com.project1.entities.data.Task;
import com.project1.service.TaskService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/public/task/admin/*")
@AllArgsConstructor
public class TaskController {

    private final TaskService taskService;

    private final ProjectRepository projectRepository;

    @GetMapping("find-all")
    public ResponseEntity<Object> findAll() {

        try {
            List<TaskDTO> taskDTOs = taskService.findAll();
            return taskDTOs != null ? ResponseEntity.ok(taskDTOs) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("find-by-id/{id}")
    public ResponseEntity<Object> findById(@PathVariable("id") Integer id) {

        try {
            TaskDTO taskDTO = taskService.findById(id);
            return taskDTO != null ? ResponseEntity.ok(taskDTO) : ResponseEntity.noContent().build();
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
                                              @RequestParam(name = "isASC", required = false) Boolean isASC,
                                              @RequestParam(name = "idProject", required = false) Integer idProject) {

        try {
            List<TaskDTO> taskDTOs = taskService.search_sort(new TaskDTO(Task.builder().name(name)
                    .createDate(createDate).project(projectRepository.findByIdAndDeletedFalse(idProject)).build(),
                    null), field, isASC, status);
            return taskDTOs != null ? ResponseEntity.ok(taskDTOs) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("insert")
    public ResponseEntity<Object> insert(@RequestBody TaskDTO taskDTO) {
        try {
            TaskDTO dto = taskService.insert(taskDTO);
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("update")
    public ResponseEntity<Object> update(@RequestBody TaskDTO taskDTO) {
        try {
            TaskDTO dto = taskService.update(taskDTO);
            return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Object> delete(Authentication authentication, @PathVariable("id") Integer id) {
        try {
            User user = (User) authentication.getPrincipal();
            if (taskService.delete(user.getUsername(), id)) {
                return ResponseEntity.ok("Delete Successful");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.badRequest().build();
    }
}
