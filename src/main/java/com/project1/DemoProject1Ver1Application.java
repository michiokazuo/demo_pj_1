package com.project1;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;

@SpringBootApplication
@AllArgsConstructor
public class DemoProject1Ver1Application implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(DemoProject1Ver1Application.class, args);
	}

	@Override
	@Transactional
	public void run(String... args) throws Exception {
	}

}
