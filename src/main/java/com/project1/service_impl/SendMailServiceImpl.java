package com.project1.service_impl;

import com.project1.service.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class SendMailServiceImpl implements SendEmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("spring.mail.username")
    private String emailSender;

    @Override
    public boolean sendMail(String userMail, String header, String content) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(userMail);
            mail.setFrom(emailSender);
            mail.setSubject(header);
            mail.setText(content);
            javaMailSender.send(mail);
            return true;
        } catch (MailException ex) {
            ex.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean sendHtmlMail(String[] userMails, String header, String content) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mail = new MimeMessageHelper(mimeMessage, "utf-8");
        try {
            mail.setCc(userMails);
            mail.setFrom(emailSender);
            mail.setSubject(header);
            mail.setText(content, true);
            javaMailSender.send(mimeMessage);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        return false;
    }
}
