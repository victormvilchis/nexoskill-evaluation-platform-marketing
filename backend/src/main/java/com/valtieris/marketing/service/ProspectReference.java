package com.valtieris.marketing.service;

import java.util.Locale;
import java.util.UUID;

final class ProspectReference {

    static final String PREFIX = "VLT-";

    private ProspectReference() {
    }

    static String fromId(Long id) {
        if (id == null || id < 1) {
            throw new IllegalArgumentException("A persisted prospect id is required.");
        }
        return PREFIX + String.format(Locale.ROOT, "%08d", id);
    }

    static String temporary() {
        return PREFIX + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }
}
