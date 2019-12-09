package com.mazamski.hospital;

import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@MapperScan("com.mazamski.hospital")
@Slf4j
public class ApplicationContextConfiguration {

    @Value("${spring.datasource.url}")
    private String dataSourceUrl;

    @Value("${spring.datasource.username}")
    private String dataSourceUserName;

    @Value("${spring.datasource.password}")
    private String dataSourcePassword;

    @Value("${spring.datasource.driver-class-name}")
    private String dataSourceDriver;

    @Value("${app.properties.recreate-database}")
    private Boolean recreateDatabase;


    @EventListener(ApplicationReadyEvent.class)
    public void loadData() {
        if (recreateDatabase) {
            log.info("> Tworzenie bazy danych");
            SimpleJdbcCall recreateDatabaseCall = new SimpleJdbcCall(dataSource())
                    .withProcedureName("create_database");
            recreateDatabaseCall.execute();
            log.info("< ukończono tworzenie bazy danych");
        }
        SimpleJdbcCall countNumberOfTablesCall = new SimpleJdbcCall(dataSource())
                .withFunctionName("count_tables");
        Integer numberOfTablesInDatabase = (Integer) (countNumberOfTablesCall.execute()).get("return");
        //System.out.println("W bazie znajduje się " + numberOfTablesInDatabase + " tabel");
        log.info("W tabeli znajduje się {} tabel", numberOfTablesInDatabase);

    }

    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
                .url(dataSourceUrl)
                .username(dataSourceUserName)
                .password(dataSourcePassword)
                .driverClassName(dataSourceDriver)
                .build();
    }

    @Bean
    public PlatformTransactionManager txManager() {
        return new DataSourceTransactionManager(dataSource());
    }
}
