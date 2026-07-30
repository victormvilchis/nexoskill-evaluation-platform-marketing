package com.valtieris.marketing.api;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record LeadRequest(
        @NotBlank @Size(max = 80) String firstName,
        @Size(max = 100) String lastName,
        @NotBlank @Email @Size(max = 180) String email,
        @Pattern(regexp = "^[0-9+()\\-\\s.]{7,40}$", message = "El teléfono contiene caracteres no permitidos.") String phone,
        @NotBlank @Size(max = 160) String company,
        @Size(max = 140) String jobTitle,
        @Size(max = 60) String companySize,
        @Size(max = 60) String teamSize,
        @Min(1) @Max(100000) Integer studentCount,
        @Size(max = 140) String serviceInterest,
        @Size(max = 300) String technologyInterest,
        @Size(max = 100) String planId,
        @NotBlank @Size(max = 2000) String message,
        @Size(max = 160) String source,
        @Size(max = 100) String utmSource,
        @Size(max = 100) String utmMedium,
        @Size(max = 160) String utmCampaign,
        @Size(max = 160) String utmContent,
        @Size(max = 160) String utmTerm,
        @Size(max = 200) String clickId,
        @Size(max = 30) String clickIdType,
        @Size(max = 500) String referrer,
        @Size(max = 500) String landingPage,
        @Size(max = 500) String conversionPage,
        Instant attributionCapturedAt,
        @Pattern(regexp = "^(GRANTED|DENIED|UNSET)$", message = "El estado de consentimiento analítico no es válido.") String analyticsConsent,
        @AssertTrue(message = "Debes aceptar el aviso de privacidad.") boolean consentPrivacy,
        @NotNull Instant formStartedAt,
        @Size(max = 200) String website
) {
}
