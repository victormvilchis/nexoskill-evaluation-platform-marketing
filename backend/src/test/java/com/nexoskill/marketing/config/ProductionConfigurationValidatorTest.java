package com.nexoskill.marketing.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ProductionConfigurationValidatorTest {

    @Test
    void acceptsSafeProductionConfiguration() {
        MockEnvironment environment = baseEnvironment();
        ProductionConfigurationValidator validator = new ProductionConfigurationValidator(environment);
        assertDoesNotThrow(() -> validator.run(new DefaultApplicationArguments(new String[0])));
    }

    @Test
    void rejectsSystemDatabaseUser() {
        MockEnvironment environment = baseEnvironment().withProperty("DB_USERNAME", "SYSTEM");
        ProductionConfigurationValidator validator = new ProductionConfigurationValidator(environment);
        assertThrows(IllegalStateException.class, () -> validator.run(new DefaultApplicationArguments(new String[0])));
    }

    @Test
    void rejectsMissingDatabasePassword() {
        MockEnvironment environment = baseEnvironment().withProperty("DB_PASSWORD", "");
        ProductionConfigurationValidator validator = new ProductionConfigurationValidator(environment);
        assertThrows(IllegalStateException.class, () -> validator.run(new DefaultApplicationArguments(new String[0])));
    }

    @Test
    void rejectsPlaceholderDatabaseUrl() {
        MockEnvironment environment = baseEnvironment()
                .withProperty("DB_URL", "jdbc:oracle:thin:@//REPLACE_WITH_ORACLE_HOST:1521/XEPDB1");
        ProductionConfigurationValidator validator = new ProductionConfigurationValidator(environment);
        assertThrows(IllegalStateException.class, () -> validator.run(new DefaultApplicationArguments(new String[0])));
    }

    @Test
    void rejectsLocalhostCorsInProduction() {
        MockEnvironment environment = baseEnvironment().withProperty("CORS_ALLOWED_ORIGINS", "http://localhost:5174");
        ProductionConfigurationValidator validator = new ProductionConfigurationValidator(environment);
        assertThrows(IllegalStateException.class, () -> validator.run(new DefaultApplicationArguments(new String[0])));
    }

    @Test
    void rejectsIncompleteMailConfigurationWhenEnabled() {
        MockEnvironment environment = baseEnvironment()
                .withProperty("MAIL_ENABLED", "true")
                .withProperty("MAIL_HOST", "")
                .withProperty("MAIL_FROM", "")
                .withProperty("CONTACT_RECIPIENT", "");
        ProductionConfigurationValidator validator = new ProductionConfigurationValidator(environment);
        assertThrows(IllegalStateException.class, () -> validator.run(new DefaultApplicationArguments(new String[0])));
    }

    private MockEnvironment baseEnvironment() {
        return new MockEnvironment()
                .withProperty("DB_URL", "jdbc:oracle:thin:@//oracle.internal:1521/XEPDB1")
                .withProperty("DB_USERNAME", "EVALUATION_APP")
                .withProperty("DB_PASSWORD", "StrongDatabasePassword123!")
                .withProperty("IP_HASH_SALT", "0123456789abcdef0123456789abcdef")
                .withProperty("CORS_ALLOWED_ORIGINS", "https://nexoskill.example")
                .withProperty("MAIL_ENABLED", "false");
    }
}
