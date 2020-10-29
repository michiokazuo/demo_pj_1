package com.project1.dto;

import com.project1.entities.data.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectDTO {

    private Project project;
    private List<TaskDTO> taskDTOs;
}
