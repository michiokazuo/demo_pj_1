package com.project1.service_impl;

import java.util.*;
import java.util.stream.Collectors;

import com.project1.convert.Convert;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.project1.dto.TaskDTO;
import com.project1.entities.data.Task;
import com.project1.entities.data.TaskToEmployee;
import com.project1.repository.TaskRepository;
import com.project1.repository.TaskToEmployeeRepository;
import com.project1.service.TaskService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    private final TaskToEmployeeRepository taskToEmployeeRepository;

    private final Convert<Task, TaskToEmployee, TaskDTO> convert;

    @Override
    public List<TaskDTO> findAll() throws Exception {
        List<Task> tasks = taskRepository.findAllByDeletedFalse();
        List<TaskToEmployee> taskToEmployees = taskToEmployeeRepository.findAllByDeletedFalse();

        return convert.toDTO(tasks, taskToEmployees);
    }

    @Override
    public TaskDTO findById(Integer id) throws Exception {
        if (id == null || id < 0)
            return null;
        else {
            Task task = taskRepository.findByIdAndDeletedFalse(id);
            List<TaskToEmployee> taskToEmployees = taskToEmployeeRepository.findByTaskIdAndDeletedFalse(task.getId());

            TaskDTO taskDTO = new TaskDTO(task, new ArrayList<>());

            for (TaskToEmployee t : taskToEmployees) {
                taskDTO.getTaskToEmployees().add(t);
            }

            if (taskDTO.getTaskToEmployees().isEmpty()) {
                taskDTO.setTaskToEmployees(null);
            }

            return taskDTO;
        }
    }

    @Override
    public TaskDTO update(TaskDTO taskDTO) throws Exception {
        if (taskDTO == null || taskDTO.getTask() == null) return null;
        Task task = taskDTO.getTask();
        task.setDeleted(false);

        return checkSave(task) ? findById(taskRepository.save(task).getId()) : null;
    }

    @Override
    public boolean delete(Integer id) throws Exception {
        return id != null && id > 0 && (taskRepository.deleteCustom(id) >= 0
                && taskToEmployeeRepository.deleteCustomByTaskId(id) >= 0);
    }

    @Override
    public List<TaskDTO> search_sort(TaskDTO taskDTO, String field, Boolean isASC, Byte status) throws Exception {
        long msDay = 24 * 60 * 60 * 1000;
        Task t = new Task();
        if (taskDTO != null && taskDTO.getTask() != null) {
            t = taskDTO.getTask();
            t.setDeleted(false);
        }
        List<Task> tasks = (field != null && isASC != null)
                ? taskRepository.findAll(
                Example.of(t, ExampleMatcher.matchingAll()
                        .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)),
                Sort.by(isASC ? Sort.Direction.ASC : Sort.Direction.DESC, field))
                : taskRepository.findAll(Example.of(t, ExampleMatcher.matchingAll()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)));

        // status : null -- all
        //          1 -- complete
        //          0 -- processing
        //          -1 -- valid
        if (status != null) {
            Date date = new Date();
            tasks = status == 0 ? tasks.stream()
                    .filter(task -> task.getCompleteDate() == null && (task.getEndDate().getTime() > date.getTime()
                            || Math.abs(date.getTime() - task.getEndDate().getTime()) < msDay))
                    .collect(Collectors.toList())
                    : (status == -1 ? tasks.stream().filter(task -> (task.getCompleteDate() == null
                    && date.getTime() - task.getEndDate().getTime() >= msDay))
                    .collect(Collectors.toList())
                    : tasks.stream().filter(task -> task.getCompleteDate() != null).collect(Collectors.toList()));
        }

        List<Integer> ids = new ArrayList<>();

        for (Task ta : tasks) {
            ids.add(ta.getId());
        }

        return convert.toDTO(tasks, taskToEmployeeRepository.findByTaskIdInAndDeletedFalse(ids));
    }

    @Override
    public TaskDTO insert(TaskDTO taskDTO) throws Exception {
        if (taskDTO == null || taskDTO.getTask() == null) return null;
        Task task = taskDTO.getTask();
        task.setDeleted(false);
        task.setCompleteDate(null);
        return checkSave(task) ? findById(taskRepository.save(task).getId()) : null;
    }

    public boolean checkSave(Task task) {
//        long msDay = 24 * 60 * 60;
        boolean rs = false;
        if (task.getEndDate().getTime() - task.getCreateDate().getTime() >= 0
                && task.getProject().getCreateDate().getTime() - task.getCreateDate().getTime() <= 0
                && task.getProject().getEndDate().getTime() - task.getEndDate().getTime() >= 0
                && task.getProject().getCompleteDate() == null) // du an da hoan thanh ko cho chinh sua
            if (task.getCompleteDate() == null) {
                rs = true;
            } else {
                long complete_create = task.getCompleteDate().getTime() - task.getCreateDate().getTime();
//            long end_complete = t.getEndDate().getTime() - t.getCompleteDate().getTime();

                // auto update end_date = complete_date when valid ????
                if (complete_create >= 0) {
                    rs = true;
                }

                if (rs) {
                    List<TaskToEmployee> taskToEmployees = taskToEmployeeRepository.findByTaskIdAndDeletedFalse(task.getId());

                    if (taskToEmployees == null) rs = false;
                    else
                        for (TaskToEmployee taskToEmployee : taskToEmployees) {
                            if (taskToEmployee.getProgress() != 100) {
                                rs = false;
                                break;
                            }
                        }
                }
            }

        return rs;
    }
}
