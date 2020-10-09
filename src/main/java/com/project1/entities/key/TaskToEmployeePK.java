package com.project1.entities.key;

import java.io.Serializable;
import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The primary key class for the task_to_employee database table.
 * 
 */
@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskToEmployeePK implements Serializable {

	@Column(name = "task_id")
	private Integer taskId;

	@Column(name = "employee_id")
	private Integer employeeId;

}