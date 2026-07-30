package com.valtieris.marketing.api;

import java.time.OffsetDateTime;

public record LeadResponse(String reference, String message, OffsetDateTime submittedAt) {
}
