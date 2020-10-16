package com.project1.convert;

import com.project1.dto.TaskDTO;
import com.project1.entities.data.Task;
import com.project1.entities.data.TaskToEmployee;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

@Service
public class TaskConvert implements Convert<Task, TaskToEmployee, TaskDTO> {
    @Override
    public List<TaskDTO> toDTO(List<Task> m1, List<TaskToEmployee> m2) throws Exception {
        List<TaskDTO> taskDTOs = new ArrayList<TaskDTO>();
        ListIterator<TaskToEmployee> listIterator = null;

        for (Task t : m1) {
            TaskDTO taskDTO = new TaskDTO(t, new ArrayList<TaskToEmployee>());

            listIterator = m2.listIterator();
            while (listIterator.hasNext()) {
                TaskToEmployee taskToEmployee = listIterator.next();

                if (t.getId().equals(taskToEmployee.getTask().getId())) {
                    taskToEmployee.setTask(null);
                    taskDTO.getTaskToEmployees().add(taskToEmployee);
                    listIterator.remove();
                }

            }

            if (taskDTO.getTaskToEmployees().isEmpty()) {
                taskDTO.setTaskToEmployees(null);
            }

            taskDTOs.add(taskDTO);
        }

        return taskDTOs.size() > 0 ? taskDTOs : null;
    }
}
