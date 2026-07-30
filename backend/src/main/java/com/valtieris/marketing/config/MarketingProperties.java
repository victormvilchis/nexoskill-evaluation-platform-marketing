package com.valtieris.marketing.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

@ConfigurationProperties(prefix = "app")
public record MarketingProperties(
        Cors cors,
        Mail mail,
        Spam spam,
        RateLimit rateLimit,
        Security security
) {
    public MarketingProperties {
        cors = cors == null ? new Cors(List.of("http://localhost:5174")) : cors;
        mail = mail == null ? new Mail(false, "", "", "Valtieris") : mail;
        spam = spam == null ? new Spam(Duration.ofSeconds(2), Duration.ofHours(24), Duration.ofMinutes(3), 2) : spam;
        rateLimit = rateLimit == null ? new RateLimit(8, Duration.ofMinutes(15)) : rateLimit;
        security = security == null ? new Security("change-this-before-production", false) : security;
    }

    public record Cors(List<String> allowedOrigins) {
        public Cors {
            allowedOrigins = allowedOrigins == null || allowedOrigins.isEmpty()
                    ? List.of("http://localhost:5174")
                    : allowedOrigins.stream().map(String::trim).filter(value -> !value.isBlank()).toList();
        }
    }

    public record Mail(boolean enabled, String recipient, String from, String brandName) {
        public Mail {
            recipient = recipient == null ? "" : recipient.trim();
            from = from == null ? "" : from.trim();
            brandName = brandName == null || brandName.isBlank() ? "Valtieris" : brandName.trim();
        }
    }

    public record Spam(Duration minimumCompletionTime, Duration maximumCompletionTime, Duration duplicateWindow, int maximumUrls) {
    }

    public record RateLimit(int requests, Duration window) {
    }

    public record Security(String ipHashSalt, boolean trustForwardedHeaders) {
        public Security {
            ipHashSalt = ipHashSalt == null || ipHashSalt.isBlank() ? "change-this-before-production" : ipHashSalt;
        }
    }
}
