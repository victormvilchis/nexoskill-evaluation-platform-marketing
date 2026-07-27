package com.nexoskill.marketing.service;

public class DuplicateSubmissionException extends RuntimeException {
    public DuplicateSubmissionException(String message) {
        super(message);
    }
}
