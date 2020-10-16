package com.project1.entities.data;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "task")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Lob
	@Column(name = "`\r\ndescription`")
	private String description;

	@Temporal(TemporalType.DATE)
	@Column(name = "complete_date")
	private Date completeDate;

	@Temporal(TemporalType.DATE)
	@Column(name = "create_date")
	private Date createDate;

	@Builder.Default
	private Boolean deleted = false;

	@Temporal(TemporalType.DATE)
	@Column(name = "end_date")
	private Date endDate;

	private String name;

}