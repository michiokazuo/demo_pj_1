package com.project1.controller;

import com.project1.config.AppConfig;
import com.project1.entities.data.Employee;
import com.project1.repository.EmployeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@AllArgsConstructor
public class MainController {

    private final EmployeeRepository employeeRepository;

    @GetMapping("/")
    public String home(Authentication authentication, HttpServletRequest req) {
        return "redirect:/trang-chu";
    }

    @GetMapping("/trang-chu")
    public String homePage(Authentication authentication, HttpServletRequest req) {
        checkUser(authentication, req);
        return "home";
    }

    @GetMapping(value = "/dang-nhap")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/du-an")
    public String project(Authentication authentication, HttpServletRequest req) {
        checkUser(authentication, req);
        return "project";
    }

    @GetMapping("/nhan-vien")
    public String employee(Authentication authentication, HttpServletRequest req) {
        checkUser(authentication, req);
        return "employee";
    }

    @GetMapping("/thong-ke")
    public String statistic(Authentication authentication, HttpServletRequest req) {
        checkUser(authentication, req);
        return "statistic";
    }

    @GetMapping("/du-an/cong-viec-thanh-phan")
    public String taskOfProject(Authentication authentication, HttpServletRequest req) {
        checkUser(authentication, req);
        return "task_of_project";
    }

    @GetMapping(value = {"/nhan-vien/tien-do-ca-nhan", "cong-viec-ca-nhan"})
    public String employeeProgress(Authentication authentication, HttpServletRequest req) {
        checkUser(authentication, req);
        return "employee_progress";
    }

    @GetMapping("/thong-tin-ca-nhan")
    public String userInformation(Authentication authentication, HttpServletRequest req) {
        checkUser(authentication, req);
        return "user_infor";
    }

    @GetMapping("/danh-gia")
    public String evaluationEmployee(Authentication authentication, HttpServletRequest req) {
        checkUser(authentication, req);
        return "evaluation_employee";
    }

    private void checkUser(Authentication authentication, HttpServletRequest req) {
        if (authentication != null) {
            User user = (User) authentication.getPrincipal();
            Employee employee = employeeRepository.findByEmailAndDeletedFalse(user.getUsername());

            if (employee != null) {
                req.setAttribute("name", employee.getName());

                if (employee.getRole().getName().equalsIgnoreCase(AppConfig.roles.get(AppConfig.ADMIN).getName())) {
                    req.setAttribute("admin", employee.getRole().getName());
                } else {
                    req.setAttribute("user", employee.getRole().getName());
                }
            }
        }
    }
}
