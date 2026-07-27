package com.nexoskill.marketing.api;

import com.nexoskill.marketing.domain.RequestType;
import com.nexoskill.marketing.service.LeadService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping("/contact")
    public ResponseEntity<LeadResponse> contact(@Valid @RequestBody LeadRequest request, HttpServletRequest httpRequest) {
        return created(RequestType.CONTACT, request, httpRequest);
    }

    @PostMapping("/demo")
    public ResponseEntity<LeadResponse> demo(@Valid @RequestBody LeadRequest request, HttpServletRequest httpRequest) {
        return created(RequestType.DEMO, request, httpRequest);
    }

    @PostMapping("/quote")
    public ResponseEntity<LeadResponse> quote(@Valid @RequestBody LeadRequest request, HttpServletRequest httpRequest) {
        return created(RequestType.QUOTE, request, httpRequest);
    }

    @PostMapping("/advisory")
    public ResponseEntity<LeadResponse> advisory(@Valid @RequestBody LeadRequest request, HttpServletRequest httpRequest) {
        return created(RequestType.ADVISORY, request, httpRequest);
    }

    @PostMapping("/bootcamp")
    public ResponseEntity<LeadResponse> bootcamp(@Valid @RequestBody LeadRequest request, HttpServletRequest httpRequest) {
        return created(RequestType.BOOTCAMP, request, httpRequest);
    }

    private ResponseEntity<LeadResponse> created(RequestType type, LeadRequest request, HttpServletRequest httpRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leadService.submit(type, request, httpRequest));
    }
}
