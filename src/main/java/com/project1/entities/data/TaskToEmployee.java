package com.project1.entities.data;

import javax.persistence.*;

import com.project1.entities.key.TaskToEmployeePK;

import lombok.*;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "task_to_employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskToEmployee {

    @EmbeddedId
    private TaskToEmployeePK id;

    @Builder.Default
    private Boolean deleted = false;

    @Builder.Default
    private Boolean paused = false;

    @Builder.Default
    private Integer progress = 0;

    @ManyToOne
    @MapsId("employeeId")
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @MapsId("taskId")
    @JoinColumn(name = "task_id")
    private Task task;

    @Temporal(TemporalType.DATE)
    @Column(name = "modify_date")
    private Date modifyDate;

    @ManyToOne
    @JoinColumn(name = "modify_by")
    private Employee modifyBy;
}