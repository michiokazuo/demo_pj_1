package com.project1.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
public class ErrorHandlerController implements ErrorController {

    @RequestMapping("/error")
    public String handle(Model model, HttpServletRequest request){
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if(status != null){
            model.addAttribute("status",Integer.valueOf(status.toString()));
        }
        return "error_page";
    }

    @Override
    public String getErrorPath() {
        return "/error";
    }
}
