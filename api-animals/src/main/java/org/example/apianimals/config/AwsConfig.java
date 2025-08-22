package org.example.apianimals.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;

@Configuration
public class AwsConfig {
    @Value("${spring.cloud.aws.credentials.access-key}")
    String accessKey;
    @Value("${spring.cloud.aws.credentials.secret-key}")
    String secretKey;
    @Bean
    public AwsCredentialsProvider awsCredentialsProvider() {
        return StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)
        );
    }

//    @Bean
//    public SnsClient snsClient() {
//        return SnsClient.builder()
//                .region(Region.EU_NORTH_1)
//                .build();
//    }
}