package com.valtieris.marketing.service;

import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.regex.Pattern;

@Component
public class TextSanitizer {

    private static final Pattern CONTROL_CHARACTERS = Pattern.compile("[\\p{Cntrl}&&[^\\r\\n\\t]]");
    private static final Pattern REPEATED_SPACES = Pattern.compile("[ \\t]{2,}");
    private static final Pattern REPEATED_LINES = Pattern.compile("\\n{3,}");

    public String clean(String value) {
        if (value == null) return null;
        String cleaned = CONTROL_CHARACTERS.matcher(value).replaceAll("")
                .replace("\r\n", "\n")
                .replace('\r', '\n')
                .trim();
        cleaned = REPEATED_SPACES.matcher(cleaned).replaceAll(" ");
        return REPEATED_LINES.matcher(cleaned).replaceAll("\n\n");
    }

    public String lower(String value) {
        String cleaned = clean(value);
        return cleaned == null ? null : cleaned.toLowerCase(Locale.ROOT);
    }
}
