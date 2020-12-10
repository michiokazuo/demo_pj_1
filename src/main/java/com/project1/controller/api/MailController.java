package com.project1.controller.api;

import com.project1.service.SendEmailService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/mail/*")
@AllArgsConstructor
public class MailController {

    private final SendEmailService sendEmailService;

    @PostMapping("/notify")
    public ResponseEntity<String> notify(@RequestParam("emails") String emails,
                                               @RequestParam("header") String header,
                                               @RequestParam("content") String content) {
        try {
            if (sendEmailService.sendHtmlMail(emails.split(" "), header, content))
                return ResponseEntity.ok("Notify Complete");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.noContent().build();
    }

}
