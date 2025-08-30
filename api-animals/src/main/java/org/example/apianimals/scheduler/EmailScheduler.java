package org.example.apianimals.scheduler;

import org.example.apianimals.config.SnsPublisher;
import org.example.apianimals.service.impl.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EmailScheduler {
    private final EmailService emailService;
    private final SnsPublisher snsPublisher;

    @Autowired
    public EmailScheduler(EmailService emailService, SnsPublisher snsPublisher) {
        this.emailService = emailService;
        this.snsPublisher = snsPublisher;
    }
    @Scheduled(cron = "0 * * * * ?")
    public void sendRapelEmailsDaily() {
        emailService.sendDailyRapelEmails();
    }
}


