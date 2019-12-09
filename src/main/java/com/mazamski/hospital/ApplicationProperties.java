package com.mazamski.hospital;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("app.properties")
public class ApplicationProperties {
    Boolean recreateDatabase;
}
