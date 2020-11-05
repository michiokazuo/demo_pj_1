package com.project1.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class MainController {
    @GetMapping(value = {"/", "/trang-chu"})
    public String home() {
        return "home";
    }

    @GetMapping("/du-an")
    public String project(Model model, HttpServletRequest req) {
        return "project";
    }

    @GetMapping("/nhan-vien")
    public String employee(Model model, HttpServletRequest req) {
        return "employee";
    }

    @GetMapping("/thong-ke")
    public String statistic(Model model, HttpServletRequest req) {
        return "statistic";
    }

    @GetMapping("/du-an/cong-viec-thanh-phan")
    public String taskOfProject() {
        return "task_of_project";
    }

    @GetMapping("/nhan-vien/tien-do-ca-nhan")
    public String employeeProgress() {
        return "employee_progress";
    }
}
