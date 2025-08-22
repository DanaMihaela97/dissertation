package org.example.apianimals;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ApiAnimalsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiAnimalsApplication.class, args);
	}

}
