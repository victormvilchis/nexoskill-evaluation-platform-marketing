package com.nexoskill.marketing.service;

import com.nexoskill.marketing.api.LeadRequest;
import com.nexoskill.marketing.api.LeadResponse;
import com.nexoskill.marketing.config.ClientIdentityService;
import com.nexoskill.marketing.config.MarketingProperties;
import com.nexoskill.marketing.domain.Prospect;
import com.nexoskill.marketing.domain.ProspectRepository;
import com.nexoskill.marketing.domain.ProspectStatus;
import com.nexoskill.marketing.domain.RequestType;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HexFormat;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LeadService {

    private static final Logger LOGGER = LoggerFactory.getLogger(LeadService.class);
    private static final Pattern URL_PATTERN = Pattern.compile("(?i)\\b(?:https?://|www\\.)\\S+");

    private final ProspectRepository repository;
    private final TextSanitizer sanitizer;
    private final MarketingProperties properties;
    private final ClientIdentityService clientIdentityService;
    private final MailNotificationService mailNotificationService;
    private final Clock clock;

    public LeadService(
            ProspectRepository repository,
            TextSanitizer sanitizer,
            MarketingProperties properties,
            ClientIdentityService clientIdentityService,
            MailNotificationService mailNotificationService,
            Clock clock
    ) {
        this.repository = repository;
        this.sanitizer = sanitizer;
        this.properties = properties;
        this.clientIdentityService = clientIdentityService;
        this.mailNotificationService = mailNotificationService;
        this.clock = clock;
    }

    @Transactional
    public LeadResponse submit(RequestType type, LeadRequest request, HttpServletRequest httpRequest) {
        Instant now = clock.instant();
        if (request.website() != null && !request.website().isBlank()) {
            return silentAcceptance(now);
        }

        validateTiming(request.formStartedAt(), now);
        validateMessage(request.message());
        validateTypeSpecific(type, request);

        Prospect prospect = map(type, request, httpRequest, now);
        OffsetDateTime duplicateThreshold = OffsetDateTime.ofInstant(now.minus(properties.spam().duplicateWindow()), ZoneOffset.UTC);
        if (repository.existsByContentFingerprintAndCreatedAtAfter(prospect.getContentFingerprint(), duplicateThreshold)) {
            throw new DuplicateSubmissionException("Ya recibimos una solicitud similar. Espera unos minutos antes de volver a enviarla.");
        }

        Prospect saved = repository.save(prospect);
        mailNotificationService.notifySubmission(saved);
        LOGGER.info("Marketing prospect created. id={}, type={}", saved.getId(), saved.getRequestType());
        return new LeadResponse(reference(saved.getId()), "Recibimos tu solicitud. El equipo de Valtieris se pondrá en contacto contigo.", saved.getCreatedAt());
    }

    private Prospect map(RequestType type, LeadRequest request, HttpServletRequest httpRequest, Instant now) {
        Prospect prospect = new Prospect();
        prospect.setRequestType(type);
        prospect.setStatus(ProspectStatus.NEW);
        prospect.setFirstName(sanitizer.clean(request.firstName()));
        prospect.setLastName(sanitizer.clean(request.lastName()));
        prospect.setEmail(sanitizer.lower(request.email()));
        prospect.setPhone(sanitizer.clean(request.phone()));
        prospect.setCompany(sanitizer.clean(request.company()));
        prospect.setJobTitle(sanitizer.clean(request.jobTitle()));
        prospect.setCompanySize(sanitizer.clean(request.companySize()));
        prospect.setTeamSize(sanitizer.clean(request.teamSize()));
        prospect.setStudentCount(request.studentCount());
        prospect.setServiceInterest(defaultService(type, sanitizer.clean(request.serviceInterest())));
        prospect.setTechnologyInterest(sanitizer.clean(request.technologyInterest()));
        prospect.setPlanId(sanitizer.clean(request.planId()));
        prospect.setMessage(sanitizer.clean(request.message()));
        prospect.setSource(limit(sanitizer.clean(request.source()), 160));
        prospect.setUtmSource(limit(sanitizer.clean(request.utmSource()), 100));
        prospect.setUtmMedium(limit(sanitizer.clean(request.utmMedium()), 100));
        prospect.setUtmCampaign(limit(sanitizer.clean(request.utmCampaign()), 160));
        prospect.setUtmContent(limit(sanitizer.clean(request.utmContent()), 160));
        prospect.setUtmTerm(limit(sanitizer.clean(request.utmTerm()), 160));
        prospect.setClickId(limit(sanitizer.clean(request.clickId()), 200));
        prospect.setClickIdType(limit(sanitizer.lower(request.clickIdType()), 30));
        prospect.setReferrer(limit(sanitizer.clean(request.referrer()), 500));
        prospect.setLandingPage(limit(sanitizer.clean(request.landingPage()), 500));
        prospect.setConversionPage(limit(sanitizer.clean(request.conversionPage()), 500));
        prospect.setAttributionCapturedAt(request.attributionCapturedAt() == null
                ? null
                : OffsetDateTime.ofInstant(request.attributionCapturedAt(), ZoneOffset.UTC));
        String analyticsConsent = limit(sanitizer.clean(request.analyticsConsent()), 20);
        prospect.setAnalyticsConsent(analyticsConsent == null ? "UNSET" : analyticsConsent);
        prospect.setConsentPrivacy(request.consentPrivacy());
        prospect.setConsentAt(OffsetDateTime.ofInstant(now, ZoneOffset.UTC));
        prospect.setIpHash(clientIdentityService.hashIp(httpRequest));
        prospect.setUserAgent(limit(sanitizer.clean(httpRequest.getHeader("User-Agent")), 500));
        prospect.setContentFingerprint(fingerprint(type, prospect));
        prospect.setCreatedAt(OffsetDateTime.ofInstant(now, ZoneOffset.UTC));
        return prospect;
    }

    private void validateTiming(Instant startedAt, Instant now) {
        Duration elapsed = Duration.between(startedAt, now);
        if (elapsed.isNegative() || elapsed.compareTo(properties.spam().minimumCompletionTime()) < 0) {
            throw new InvalidSubmissionException("El formulario se envió demasiado rápido. Revisa la información e intenta nuevamente.");
        }
        if (elapsed.compareTo(properties.spam().maximumCompletionTime()) > 0) {
            throw new InvalidSubmissionException("La sesión del formulario expiró. Recarga la página e intenta nuevamente.");
        }
    }

    private void validateMessage(String message) {
        Matcher matcher = URL_PATTERN.matcher(message == null ? "" : message);
        int urls = 0;
        while (matcher.find()) urls++;
        if (urls > properties.spam().maximumUrls()) {
            throw new InvalidSubmissionException("El mensaje contiene demasiados enlaces.");
        }
    }

    private void validateTypeSpecific(RequestType type, LeadRequest request) {
        if (type == RequestType.QUOTE && (request.planId() == null || request.planId().isBlank())) {
            throw new InvalidSubmissionException("Selecciona un plan para solicitar la cotización.");
        }
    }

    private String defaultService(RequestType type, String service) {
        if (service != null && !service.isBlank()) return service;
        return switch (type) {
            case CONTACT -> "Contacto comercial";
            case DEMO -> "Demostración de plataforma";
            case QUOTE -> "Cotización";
            case ADVISORY -> "Asesoría";
            case BOOTCAMP -> "Bootcamp";
        };
    }

    private String fingerprint(RequestType type, Prospect prospect) {
        String material = String.join("|",
                type.name(),
                prospect.getEmail().toLowerCase(Locale.ROOT),
                prospect.getCompany().toLowerCase(Locale.ROOT),
                prospect.getMessage().toLowerCase(Locale.ROOT),
                prospect.getPlanId() == null ? "" : prospect.getPlanId().toLowerCase(Locale.ROOT)
        );
        return sha256(material);
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }

    private String limit(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) return value;
        return value.substring(0, maxLength);
    }

    private LeadResponse silentAcceptance(Instant now) {
        return new LeadResponse("VT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT), "Recibimos tu solicitud. El equipo de Valtieris se pondrá en contacto contigo.", OffsetDateTime.ofInstant(now, ZoneOffset.UTC));
    }

    private String reference(Long id) {
        return "NS-" + String.format("%08d", id);
    }
}
