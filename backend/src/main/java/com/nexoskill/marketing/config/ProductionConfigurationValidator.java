package com.nexoskill.marketing.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Locale;

@Component
@Profile("prod")
public class ProductionConfigurationValidator implements ApplicationRunner {

    private final Environment environment;

    public ProductionConfigurationValidator(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        String username = required("DB_USERNAME");
        String normalizedUser = username.toUpperCase(Locale.ROOT);
        if (normalizedUser.equals("SYSTEM") || normalizedUser.equals("SYS")) {
            throw new IllegalStateException("DB_USERNAME debe ser un usuario aplicativo y no SYSTEM/SYS.");
        }

        String salt = required("IP_HASH_SALT");
        if (salt.length() < 32 || salt.equals("change-this-before-production")) {
            throw new IllegalStateException("IP_HASH_SALT debe tener al menos 32 caracteres y no usar el valor predeterminado.");
        }

        String origins = required("CORS_ALLOWED_ORIGINS");
        if (origins.contains("*") || origins.toLowerCase(Locale.ROOT).contains("localhost")) {
            throw new IllegalStateException("CORS_ALLOWED_ORIGINS debe contener únicamente orígenes HTTPS explícitos en producción.");
        }
        boolean hasHttpsOrigin = Arrays.stream(origins.split(","))
                .map(String::trim)
                .allMatch(origin -> origin.startsWith("https://"));
        if (!hasHttpsOrigin) {
            throw new IllegalStateException("Todos los orígenes de producción deben utilizar HTTPS.");
        }

        if (Boolean.parseBoolean(environment.getProperty("MAIL_ENABLED", "false"))) {
            required("MAIL_HOST");
            required("MAIL_FROM");
            required("CONTACT_RECIPIENT");
        }
    }

    private String required(String key) {
        String value = environment.getProperty(key);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Falta la variable obligatoria de producción: " + key);
        }
        return value.trim();
    }
}
