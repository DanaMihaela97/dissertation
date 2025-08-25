package org.example.apianimals.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.*;


@Configuration
public class SnsPublisher {
    private final SnsClient SnsClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String snsTopicArn = "arn:aws:sns:eu-north-1:014498632459:vetcare-sns";

    @Autowired
    public SnsPublisher(SnsClient SnsClient) {
        this.SnsClient = SnsClient;
    }

    @Data
    static class SnsMessage{
        String subject;
        String email;
        String message;
    }

    @Data
    static class SesSubscribePayload {
        String email;
    }

    public void sendEmail(String subject, String message, String email) {
        SnsMessage snsMessage = new SnsMessage();
        snsMessage.setSubject(subject);
        snsMessage.setEmail(email);
        snsMessage.setMessage(message);

        String jsonMessage;
        try {
            jsonMessage = objectMapper.writeValueAsString(snsMessage);
        } catch (JsonProcessingException e) {
            System.err.println("Error converting message to JSON: " + e.getMessage());
            return;
        }
        PublishRequest request = PublishRequest.builder().topicArn(this.snsTopicArn)
                .subject(subject)
                .message(jsonMessage)
                .build();
        SnsClient.publish(request);
    }

    public void subscribe(String email) {
        if (email == null || email.trim().isEmpty()) {
            System.err.println("Error: Email address cannot be null or empty.");
            return;
        }

        SesSubscribePayload payload = new SesSubscribePayload();
        payload.setEmail(email);

        String jsonMessage;
        try {
            jsonMessage = objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            System.err.println("Error converting message to JSON: " + e.getMessage());
            return;
        }

        try {
            PublishRequest publishRequest = PublishRequest.builder()
                    .topicArn(this.snsTopicArn)
                    .message(jsonMessage)
                    .build();

            SnsClient.publish(publishRequest);

            System.out.println("Message published to SNS for email: " + email);

        } catch (SnsException e) {
            System.err.println("Error publishing to SNS topic: " + e.awsErrorDetails().errorMessage());
        }
    }
}