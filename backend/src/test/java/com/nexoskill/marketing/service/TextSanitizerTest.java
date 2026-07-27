package com.nexoskill.marketing.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TextSanitizerTest {

    private final TextSanitizer sanitizer = new TextSanitizer();

    @Test
    void normalizesWhitespaceAndControlCharacters() {
        assertThat(sanitizer.clean("  Hola\u0000   equipo\r\n\r\n\r\nNexoSkill  "))
                .isEqualTo("Hola equipo\n\nNexoSkill");
    }

    @Test
    void lowercasesEmailLikeValues() {
        assertThat(sanitizer.lower("  VENTAS@EXAMPLE.COM ")).isEqualTo("ventas@example.com");
    }
}
