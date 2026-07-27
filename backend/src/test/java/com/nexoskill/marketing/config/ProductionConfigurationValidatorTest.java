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
    void rejectsLocalhostCorsInProduction() {
        MockEnvironment environment = baseEnvironment().withProperty("CORS_ALLOWED_ORIGINS", "http://localhost:5174");
        ProductionConfigurationValidator validator = new ProductionConfigurationValidator(environment);
        assertThrows(IllegalStateException.class, () -> validator.run(new DefaultApplicationArguments(new String[0])));
    }

    private MockEnvironment baseEnvironment() {
        return new MockEnvironment()
                .withProperty("DB_USERNAME", "EVALUATION_APP")
                .withProperty("IP_HASH_SALT", "0123456789abcdef0123456789abcdef")
                .withProperty("CORS_ALLOWED_ORIGINS", "https://nexoskill.com")
                .withProperty("MAIL_ENABLED", "false");
    }
}
