package com.nexoskill.marketing.api;

import com.nexoskill.marketing.config.RequestCorrelationFilter;
import com.nexoskill.marketing.service.DuplicateSubmissionException;
import com.nexoskill.marketing.service.InvalidSubmissionException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiErrorResponse> validation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return response(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Revisa los campos marcados e intenta nuevamente.", errors, request);
    }

    @ExceptionHandler(InvalidSubmissionException.class)
    ResponseEntity<ApiErrorResponse> invalidSubmission(InvalidSubmissionException exception, HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "INVALID_SUBMISSION", exception.getMessage(), Map.of(), request);
    }

    @ExceptionHandler(DuplicateSubmissionException.class)
    ResponseEntity<ApiErrorResponse> duplicate(DuplicateSubmissionException exception, HttpServletRequest request) {
        return response(HttpStatus.CONFLICT, "DUPLICATE_SUBMISSION", exception.getMessage(), Map.of(), request);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiErrorResponse> unexpected(Exception exception, HttpServletRequest request) {
        LOGGER.error("Unexpected error while processing marketing request", exception);
        return response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                "Ocurrió un error al procesar la solicitud. Intenta nuevamente más tarde.",
                Map.of(),
                request
        );
    }

    private ResponseEntity<ApiErrorResponse> response(
            HttpStatus status,
            String code,
            String message,
            Map<String, String> fieldErrors,
            HttpServletRequest request
    ) {
        return ResponseEntity.status(status).body(new ApiErrorResponse(
                code,
                message,
                fieldErrors,
                Instant.now(),
                request.getRequestURI(),
                requestId(request)
        ));
    }

    private String requestId(HttpServletRequest request) {
        Object value = request.getAttribute(RequestCorrelationFilter.ATTRIBUTE);
        return value == null ? "" : value.toString();
    }
}
