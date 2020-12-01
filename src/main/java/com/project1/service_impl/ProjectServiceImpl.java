package com.project1.service_impl;

import com.project1.convert.Convert;
import com.project1.dto.ProjectDTO;
import com.project1.dto.TaskDTO;
import com.project1.entities.data.Project;
import com.project1.entities.data.Task;
import com.project1.entities.data.TaskToEmployee;
import com.project1.repository.EmployeeRepository;
import com.project1.repository.ProjectRepository;
import com.project1.repository.TaskRepository;
import com.project1.repository.TaskToEmployeeRepository;
import com.project1.service.ProjectService;
import com.project1.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    private final EmployeeRepository employeeRepository;

    private final TaskRepository taskRepository;

    private final TaskToEmployeeRepository taskToEmployeeRepository;

    private final TaskService taskService;

    private final Convert<Task, TaskToEmployee, TaskDTO> taskDTOConvert;

    private final Convert<Project, TaskDTO, ProjectDTO> projectDTOConvert;

    @Override
    public List<ProjectDTO> findAll() throws Exception {
        List<Project> projects = projectRepository.findAllByDeletedFalse();
        List<TaskDTO> taskDTOS = taskService.findAll();

        return projectDTOConvert.toDTO(projects, taskDTOS);
    }

    @Override
    public ProjectDTO findById(Integer id) throws Exception {
        if (id == null || id < 0)
            return null;
        else {
            Project project = projectRepository.findByIdAndDeletedFalse(id);
            List<Task> tasks = taskRepository.findByProjectIdAndDeletedFalse(project.getId());

            List<Integer> ids = new ArrayList<>();
            for (Task t : tasks) {
                ids.add(t.getId());
            }

            List<TaskToEmployee> taskToEmployees = taskToEmployeeRepository.findByTaskIdInAndDeletedFalse(ids);

            return new ProjectDTO(project, taskDTOConvert.toDTO(tasks, taskToEmployees));
        }
    }

    @Override
    public List<ProjectDTO> search_sort(ProjectDTO projectDTO, String field, Boolean isASC, Byte status)
            throws Exception {
        long msDay = 24 * 60 * 60 * 1000;
        Project project = new Project();
        if (projectDTO != null && projectDTO.getProject() != null) {
            project = projectDTO.getProject();
            project.setDeleted(false);
        }
        List<Project> projects = (field != null && isASC != null)
                ? projectRepository.findAll(
                Example.of(project, ExampleMatcher.matchingAll()
                        .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)),
                Sort.by(isASC ? Sort.Direction.ASC : Sort.Direction.DESC, field))
                : projectRepository.findAll(Example.of(project,
                ExampleMatcher.matchingAll().withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)));

        // status : null -- all
        //          1 -- complete
        //          0 -- processing
        //          -1 -- valid
        if (status != null) {
            Date date = new Date();
            projects = status == 0 ? projects.stream()
                    .filter(p -> (p.getCompleteDate() == null && p.getEndDate().getTime() > date.getTime()
                            || Math.abs(date.getTime() - p.getEndDate().getTime()) < msDay))
                    .collect(Collectors.toList())
                    : (status == -1 ? projects.stream().filter(p -> (p.getCompleteDate() == null
                    && date.getTime() - p.getEndDate().getTime() >= msDay))
                    .collect(Collectors.toList())
                    : projects.stream().filter(p -> p.getCompleteDate() != null).collect(Collectors.toList()));
        }

        List<Integer> projectIds = new ArrayList<>();
        for (Project p : projects) {
            projectIds.add(p.getId());
        }
        List<Task> tasks = taskRepository.findByProjectIdInAndDeletedFalse(projectIds);
        List<Integer> ids = new ArrayList<>();
        for (Task t : tasks) {
            ids.add(t.getId());
        }

        return projectDTOConvert.toDTO(projects,
                taskDTOConvert.toDTO(tasks, taskToEmployeeRepository.findByTaskIdInAndDeletedFalse(ids)));
    }

    @Override
    public ProjectDTO insert(ProjectDTO projectDTO) throws Exception {
        if (projectDTO == null || projectDTO.getProject() == null) return null;
        Project project = projectDTO.getProject();
        project.setDeleted(false);
        project.setCompleteDate(null);
        return checkSave(project) ? findById(projectRepository.save(project).getId()) : null;
    }

    @Override
    public ProjectDTO update(ProjectDTO projectDTO) throws Exception {
        if (projectDTO == null || projectDTO.getProject() == null) return null;
        Project project = projectDTO.getProject();
        project.setDeleted(false);
        return checkSave(project) ? findById(projectRepository.save(project).getId()) : null;
    }

    @Override
    public boolean delete(String email, Integer id) throws Exception {
        if (!(id != null && id > 0)) return false;
        else {
            List<Task> tasks = taskRepository.findByProjectIdAndDeletedFalse(id);
            List<Integer> ids = new ArrayList<>();

            for (Task t : tasks) {
                ids.add(t.getId());
            }

            return projectRepository.deleteCustom(id) >= 0 && taskRepository.deleteCustomByProjectId(id) >= 0
                    && taskToEmployeeRepository
                    .deleteCustomByTaskIdIn(employeeRepository.findByEmailAndDeletedFalse(email), ids) >= 0;
        }

    }

    public boolean checkSave(Project project) {
//        long msDay = 24 * 60 * 60;
        boolean rs = false;

        if (project.getEndDate().getTime() - project.getCreateDate().getTime() >= 0)
            if (project.getCompleteDate() == null) {
                rs = true;
            } else {
                long complete_create = project.getCompleteDate().getTime() - project.getCreateDate().getTime();
//            long end_complete = t.getEndDate().getTime() - t.getCompleteDate().getTime();

                if (complete_create >= 0) {
                    rs = true;
                }

                if (rs) {
                    List<Task> tasks = taskRepository.findByProjectIdAndDeletedFalse(project.getId());

                    if (tasks == null) rs = false;
                    else
                        for (Task task : tasks) {
                            if (task.getCompleteDate() == null
                                    || project.getCompleteDate().getTime() - task.getCompleteDate().getTime() < 0) {
                                rs = false;
                                break;
                            }
                        }
                }
            }

        return rs;
    }
}
