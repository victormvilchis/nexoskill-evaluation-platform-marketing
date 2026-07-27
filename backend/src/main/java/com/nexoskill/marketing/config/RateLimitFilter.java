package com.nexoskill.marketing.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexoskill.marketing.api.ApiErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Deque<Instant>> requestsByClient = new ConcurrentHashMap<>();
    private final MarketingProperties properties;
    private final ClientIdentityService clientIdentityService;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    public RateLimitFilter(
            MarketingProperties properties,
            ClientIdentityService clientIdentityService,
            ObjectMapper objectMapper,
            Clock clock
    ) {
        this.properties = properties;
        this.clientIdentityService = clientIdentityService;
        this.objectMapper = objectMapper;
        this.clock = clock;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equalsIgnoreCase(request.getMethod()) || !request.getRequestURI().startsWith("/api/v1/leads/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String key = clientIdentityService.hashIp(request);
        Instant now = clock.instant();
        Instant threshold = now.minus(properties.rateLimit().window());
        Deque<Instant> timestamps = requestsByClient.computeIfAbsent(key, ignored -> new ArrayDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(threshold)) {
                timestamps.removeFirst();
            }
            if (timestamps.size() >= properties.rateLimit().requests()) {
                response.setStatus(429);
                response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
                response.setCharacterEncoding("UTF-8");
                response.setHeader("Retry-After", String.valueOf(properties.rateLimit().window().toSeconds()));
                Object requestId = request.getAttribute(RequestCorrelationFilter.ATTRIBUTE);
                objectMapper.writeValue(response.getWriter(), new ApiErrorResponse(
                        "RATE_LIMIT_EXCEEDED",
                        "Espera unos minutos antes de volver a enviar el formulario.",
                        Map.of(),
                        now,
                        request.getRequestURI(),
                        requestId == null ? "" : requestId.toString()
                ));
                return;
            }
            timestamps.addLast(now);
        }

        filterChain.doFilter(request, response);
    }
}
