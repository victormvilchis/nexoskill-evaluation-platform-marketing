package com.nexoskill.marketing.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Locale;
import java.util.Set;

@Component
@Profile("prod")
public class ProductionConfigurationValidator implements ApplicationRunner {

    private static final Set<String> FORBIDDEN_DATABASE_USERS = Set.of("SYSTEM", "SYS");
    private static final Set<String> PLACEHOLDER_VALUES = Set.of(
            "change-me",
            "changeme",
            "replace-me",
            "placeholder",
            "example",
            "change-this-before-production"
    );

    private final Environment environment;

    public ProductionConfigurationValidator(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        String databaseUrl = required("DB_URL");
        if (!databaseUrl.startsWith("jdbc:oracle:thin:@//") || containsPlaceholder(databaseUrl)) {
            throw new IllegalStateException("DB_URL debe ser una URL JDBC Oracle completa y sin placeholders.");
        }

        String username = required("DB_USERNAME");
        String normalizedUser = username.toUpperCase(Locale.ROOT);
        if (FORBIDDEN_DATABASE_USERS.contains(normalizedUser)) {
            throw new IllegalStateException("DB_USERNAME debe ser un usuario aplicativo y no SYSTEM/SYS.");
        }

        String password = required("DB_PASSWORD");
        if (password.length() < 12 || containsPlaceholder(password)) {
            throw new IllegalStateException("DB_PASSWORD debe tener al menos 12 caracteres y no usar placeholders.");
        }

        String salt = required("IP_HASH_SALT");
        if (salt.length() < 32 || containsPlaceholder(salt)) {
            throw new IllegalStateException("IP_HASH_SALT debe tener al menos 32 caracteres y no usar valores de ejemplo.");
        }

        String origins = required("CORS_ALLOWED_ORIGINS");
        if (origins.contains("*") || origins.toLowerCase(Locale.ROOT).contains("localhost") || containsPlaceholder(origins)) {
            throw new IllegalStateException("CORS_ALLOWED_ORIGINS debe contener únicamente orígenes HTTPS explícitos en producción.");
        }
        boolean allOriginsAreHttps = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .allMatch(origin -> origin.startsWith("https://"));
        if (!allOriginsAreHttps) {
            throw new IllegalStateException("Todos los orígenes de producción deben utilizar HTTPS.");
        }

        if (Boolean.parseBoolean(environment.getProperty("MAIL_ENABLED", "false"))) {
            String mailHost = required("MAIL_HOST");
            String mailFrom = required("MAIL_FROM");
            String recipient = required("CONTACT_RECIPIENT");
            if (containsPlaceholder(mailHost) || containsPlaceholder(mailFrom) || containsPlaceholder(recipient)) {
                throw new IllegalStateException("La configuración SMTP no puede contener placeholders cuando MAIL_ENABLED=true.");
            }
        }
    }

    private String required(String key) {
        String value = environment.getProperty(key);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Falta la variable obligatoria de producción: " + key);
        }
        return value.trim();
    }

    private boolean containsPlaceholder(String value) {
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return PLACEHOLDER_VALUES.contains(normalized)
                || normalized.contains("replace_with")
                || normalized.contains("replace-with")
                || normalized.contains("example.invalid")
                || normalized.contains("<required>")
                || normalized.contains("<secret>");
    }
}
