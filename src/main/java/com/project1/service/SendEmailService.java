package com.project1.service;

public interface SendEmailService {
    boolean sendMail(String userMail, String header, String content);

    boolean sendHtmlMail(String[] userMails, String header, String content);
}
