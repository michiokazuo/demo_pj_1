package com.project1.convert;

import com.project1.dto.ProjectDTO;
import com.project1.dto.TaskDTO;
import com.project1.entities.data.Project;
import com.project1.entities.data.Task;
import com.project1.entities.data.TaskToEmployee;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

@Service
public class ProjectConvert implements Convert<Project, TaskDTO, ProjectDTO> {

    @Override
    public List<ProjectDTO> toDTO(List<Project> m1, List<TaskDTO> m2) throws Exception {
        List<ProjectDTO> projectDTOS = new ArrayList<>();
        ListIterator<TaskDTO> listIterator = null;

        for (Project p : m1) {
            ProjectDTO projectDTO = new ProjectDTO(p, new ArrayList<>());

            listIterator = m2.listIterator();
            while (listIterator.hasNext()) {
                TaskDTO taskDTO = listIterator.next();

                if (p.getId().equals(taskDTO.getTask().getProject().getId())) {
                    projectDTO.getTaskDTOs().add(taskDTO);
                    listIterator.remove();
                }

            }

            if (projectDTO.getTaskDTOs().isEmpty()) {
                projectDTO.setTaskDTOs(null);
            }

            projectDTOS.add(projectDTO);
        }

        return projectDTOS.size() > 0 ? projectDTOS : null;
    }
}
