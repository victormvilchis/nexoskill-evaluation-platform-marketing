package com.nexoskill.marketing.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;

public interface ProspectRepository extends JpaRepository<Prospect, Long> {

    boolean existsByContentFingerprintAndCreatedAtAfter(String contentFingerprint, OffsetDateTime createdAt);
}
