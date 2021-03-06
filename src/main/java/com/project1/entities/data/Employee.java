package com.project1.entities.data;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employee")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Builder.Default
    private Boolean deleted = false;

    private String email;

    private String name;

    private String phone;

    private String password;

    @ManyToOne
    @JoinColumn(name = "role", referencedColumnName = "id", columnDefinition = "default 1")
    private Role role;
}