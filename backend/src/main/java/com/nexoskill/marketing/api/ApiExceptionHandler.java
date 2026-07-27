package com.nexoskill.marketing.api;

import com.nexoskill.marketing.service.DuplicateSubmissionException;
import com.nexoskill.marketing.service.InvalidSubmissionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ProblemDetail> validation(MethodArgumentNotValidException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Revisa los campos marcados e intenta nuevamente.");
        problem.setTitle("Solicitud inválida");
        problem.setType(URI.create("https://nexoskill.com/problems/validation"));
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        problem.setProperty("errors", errors);
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(InvalidSubmissionException.class)
    ResponseEntity<ProblemDetail> invalidSubmission(InvalidSubmissionException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
        problem.setTitle("No fue posible procesar la solicitud");
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(DuplicateSubmissionException.class)
    ResponseEntity<ProblemDetail> duplicate(DuplicateSubmissionException exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, exception.getMessage());
        problem.setTitle("Solicitud duplicada");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ProblemDetail> unexpected(Exception exception) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error al procesar la solicitud. Intenta nuevamente más tarde.");
        problem.setTitle("Error interno");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problem);
    }
}
