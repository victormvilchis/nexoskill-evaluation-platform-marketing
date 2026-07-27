package com.nexoskill.marketing.api;

import com.nexoskill.marketing.domain.ProspectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class LeadControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProspectRepository repository;

    @BeforeEach
    void cleanDatabase() {
        repository.deleteAll();
    }

    @Test
    void storesContactRequestAndReturnsReference() throws Exception {
        String body = """
                {
                  "firstName": "María",
                  "email": "maria@empresa.com",
                  "company": "Empresa Demo",
                  "message": "Necesitamos evaluar un equipo de desarrollo.",
                  "consentPrivacy": true,
                  "formStartedAt": "%s",
                  "website": ""
                }
                """.formatted(Instant.now().minusSeconds(5));

        mockMvc.perform(post("/api/v1/leads/contact")
                        .header("X-Request-Id", "test-request-0001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(header().string("X-Request-Id", "test-request-0001"))
                .andExpect(jsonPath("$.reference", matchesPattern("NS-[0-9]{8}")))
                .andExpect(jsonPath("$.message").isNotEmpty());

        org.junit.jupiter.api.Assertions.assertEquals(1, repository.count());
    }

    @Test
    void returnsStableValidationContract() throws Exception {
        mockMvc.perform(post("/api/v1/leads/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "",
                                  "email": "correo-invalido",
                                  "company": "",
                                  "message": "",
                                  "consentPrivacy": false,
                                  "formStartedAt": "2026-07-27T12:00:00Z"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(header().exists("X-Request-Id"))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/v1/leads/contact"))
                .andExpect(jsonPath("$.requestId").isNotEmpty());
    }
}
