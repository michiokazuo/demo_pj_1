package com.project1.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;

import javax.servlet.http.HttpServletMapping;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.MappingMatch;

@Controller
public class MainController {
    @GetMapping(value = {"/", "/trang-chu"})
    public String home() {
        return "home";
    }

    @GetMapping("/cong-viec")
    public String task(Model model, HttpServletRequest req) {
        model.addAttribute("pathName", req.getAttribute(
                HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE));
        return "task";
    }

    @GetMapping("/nhan-vien")
    public String employee(Model model, HttpServletRequest req) {
        model.addAttribute("pathName", req.getAttribute(
                HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE));
        return "employee";
    }

    @GetMapping("/giao-viec")
    public String task_to_employee(Model model, HttpServletRequest req) {
        model.addAttribute("pathName", req.getAttribute(
                HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE));
        return "task_to_employee";
    }

    @GetMapping("/thong-ke")
    public String statistic(Model model, HttpServletRequest req) {
        model.addAttribute("pathName", req.getAttribute(
                HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE));
        return "statistic";
    }
}
