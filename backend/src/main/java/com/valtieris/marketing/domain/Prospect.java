package com.valtieris.marketing.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "MKT_PROSPECT")
@SequenceGenerator(name = "mktProspectSequence", sequenceName = "MKT_PROSPECT_SEQ", allocationSize = 1)
public class Prospect {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "mktProspectSequence")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "REQUEST_TYPE", nullable = false, length = 30)
    private RequestType requestType;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 30)
    private ProspectStatus status = ProspectStatus.NEW;

    @Column(name = "FIRST_NAME", nullable = false, length = 80)
    private String firstName;

    @Column(name = "LAST_NAME", length = 100)
    private String lastName;

    @Column(name = "EMAIL", nullable = false, length = 180)
    private String email;

    @Column(name = "PHONE", length = 40)
    private String phone;

    @Column(name = "COMPANY", nullable = false, length = 160)
    private String company;

    @Column(name = "JOB_TITLE", length = 140)
    private String jobTitle;

    @Column(name = "COMPANY_SIZE", length = 60)
    private String companySize;

    @Column(name = "TEAM_SIZE", length = 60)
    private String teamSize;

    @Column(name = "STUDENT_COUNT")
    private Integer studentCount;

    @Column(name = "SERVICE_INTEREST", length = 140)
    private String serviceInterest;

    @Column(name = "TECHNOLOGY_INTEREST", length = 300)
    private String technologyInterest;

    @Column(name = "PLAN_ID", length = 100)
    private String planId;

    @Column(name = "MESSAGE", nullable = false, length = 2000)
    private String message;

    @Column(name = "SOURCE", length = 160)
    private String source;

    @Column(name = "UTM_SOURCE", length = 100)
    private String utmSource;

    @Column(name = "UTM_MEDIUM", length = 100)
    private String utmMedium;

    @Column(name = "UTM_CAMPAIGN", length = 160)
    private String utmCampaign;

    @Column(name = "UTM_CONTENT", length = 160)
    private String utmContent;

    @Column(name = "UTM_TERM", length = 160)
    private String utmTerm;

    @Column(name = "CLICK_ID", length = 200)
    private String clickId;

    @Column(name = "CLICK_ID_TYPE", length = 30)
    private String clickIdType;

    @Column(name = "REFERRER_URL", length = 500)
    private String referrer;

    @Column(name = "LANDING_PAGE", length = 500)
    private String landingPage;

    @Column(name = "CONVERSION_PAGE", length = 500)
    private String conversionPage;

    @Column(name = "ATTRIBUTION_CAPTURED_AT")
    private OffsetDateTime attributionCapturedAt;

    @Column(name = "ANALYTICS_CONSENT", nullable = false, length = 20)
    private String analyticsConsent;

    @Column(name = "CONSENT_PRIVACY", nullable = false)
    private boolean consentPrivacy;

    @Column(name = "CONSENT_AT", nullable = false)
    private OffsetDateTime consentAt;

    @Column(name = "IP_HASH", length = 64)
    private String ipHash;

    @Column(name = "USER_AGENT", length = 500)
    private String userAgent;

    @Column(name = "CONTENT_FINGERPRINT", nullable = false, length = 64)
    private String contentFingerprint;

    @Column(name = "CREATED_AT", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void beforeInsert() {
        OffsetDateTime now = OffsetDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
        if (status == null) status = ProspectStatus.NEW;
    }

    @PreUpdate
    void beforeUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public RequestType getRequestType() { return requestType; }
    public void setRequestType(RequestType requestType) { this.requestType = requestType; }
    public ProspectStatus getStatus() { return status; }
    public void setStatus(ProspectStatus status) { this.status = status; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCompanySize() { return companySize; }
    public void setCompanySize(String companySize) { this.companySize = companySize; }
    public String getTeamSize() { return teamSize; }
    public void setTeamSize(String teamSize) { this.teamSize = teamSize; }
    public Integer getStudentCount() { return studentCount; }
    public void setStudentCount(Integer studentCount) { this.studentCount = studentCount; }
    public String getServiceInterest() { return serviceInterest; }
    public void setServiceInterest(String serviceInterest) { this.serviceInterest = serviceInterest; }
    public String getTechnologyInterest() { return technologyInterest; }
    public void setTechnologyInterest(String technologyInterest) { this.technologyInterest = technologyInterest; }
    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getUtmSource() { return utmSource; }
    public void setUtmSource(String utmSource) { this.utmSource = utmSource; }
    public String getUtmMedium() { return utmMedium; }
    public void setUtmMedium(String utmMedium) { this.utmMedium = utmMedium; }
    public String getUtmCampaign() { return utmCampaign; }
    public void setUtmCampaign(String utmCampaign) { this.utmCampaign = utmCampaign; }
    public String getUtmContent() { return utmContent; }
    public void setUtmContent(String utmContent) { this.utmContent = utmContent; }
    public String getUtmTerm() { return utmTerm; }
    public void setUtmTerm(String utmTerm) { this.utmTerm = utmTerm; }
    public String getClickId() { return clickId; }
    public void setClickId(String clickId) { this.clickId = clickId; }
    public String getClickIdType() { return clickIdType; }
    public void setClickIdType(String clickIdType) { this.clickIdType = clickIdType; }
    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }
    public String getLandingPage() { return landingPage; }
    public void setLandingPage(String landingPage) { this.landingPage = landingPage; }
    public String getConversionPage() { return conversionPage; }
    public void setConversionPage(String conversionPage) { this.conversionPage = conversionPage; }
    public OffsetDateTime getAttributionCapturedAt() { return attributionCapturedAt; }
    public void setAttributionCapturedAt(OffsetDateTime attributionCapturedAt) { this.attributionCapturedAt = attributionCapturedAt; }
    public String getAnalyticsConsent() { return analyticsConsent; }
    public void setAnalyticsConsent(String analyticsConsent) { this.analyticsConsent = analyticsConsent; }
    public boolean isConsentPrivacy() { return consentPrivacy; }
    public void setConsentPrivacy(boolean consentPrivacy) { this.consentPrivacy = consentPrivacy; }
    public OffsetDateTime getConsentAt() { return consentAt; }
    public void setConsentAt(OffsetDateTime consentAt) { this.consentAt = consentAt; }
    public String getIpHash() { return ipHash; }
    public void setIpHash(String ipHash) { this.ipHash = ipHash; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public String getContentFingerprint() { return contentFingerprint; }
    public void setContentFingerprint(String contentFingerprint) { this.contentFingerprint = contentFingerprint; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
