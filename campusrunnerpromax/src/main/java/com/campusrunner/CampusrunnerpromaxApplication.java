package com.campusrunner;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.campusrunner.mapper")
public class CampusrunnerpromaxApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusrunnerpromaxApplication.class, args);
    }

}
