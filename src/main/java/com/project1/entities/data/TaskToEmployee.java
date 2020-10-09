package com.project1.entities.data;

import javax.persistence.*;

import com.project1.entities.key.TaskToEmployeePK;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "task_to_employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskToEmployee {

	@EmbeddedId
	private TaskToEmployeePK id;

	private Boolean deleted;

	private Integer progress;

	@ManyToOne
	@MapsId("employeeId")
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@ManyToOne
	@MapsId("taskId")
	@JoinColumn(name = "task_id")
	private Task task;

}