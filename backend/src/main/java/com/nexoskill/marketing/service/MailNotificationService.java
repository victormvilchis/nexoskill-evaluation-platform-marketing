package com.nexoskill.marketing.service;

import com.nexoskill.marketing.config.MarketingProperties;
import com.nexoskill.marketing.domain.Prospect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MailNotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MailNotificationService.class);

    private final MarketingProperties properties;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    public MailNotificationService(MarketingProperties properties, ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.properties = properties;
        this.mailSenderProvider = mailSenderProvider;
    }

    public void notifySubmission(Prospect prospect) {
        if (!properties.mail().enabled()) return;
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null || properties.mail().recipient().isBlank()) {
            LOGGER.warn("Mail notifications are enabled but the sender or recipient is not configured. Prospect id={}", prospect.getId());
            return;
        }

        try {
            sender.send(commercialMessage(prospect));
            sender.send(confirmationMessage(prospect));
        } catch (RuntimeException exception) {
            LOGGER.error("Could not send email notifications for prospect id={}", prospect.getId(), exception);
        }
    }

    private SimpleMailMessage commercialMessage(Prospect prospect) {
        SimpleMailMessage message = baseMessage();
        message.setTo(properties.mail().recipient());
        message.setReplyTo(prospect.getEmail());
        message.setSubject("Nueva solicitud " + prospect.getRequestType() + " - " + prospect.getCompany());
        message.setText(String.join("\n", List.of(
                "Se recibió una nueva solicitud comercial en NexoSkill.",
                "",
                "Referencia: " + reference(prospect),
                "Tipo: " + prospect.getRequestType(),
                "Nombre: " + fullName(prospect),
                "Correo: " + prospect.getEmail(),
                "Teléfono: " + nullable(prospect.getPhone()),
                "Empresa: " + prospect.getCompany(),
                "Cargo: " + nullable(prospect.getJobTitle()),
                "Tamaño de empresa: " + nullable(prospect.getCompanySize()),
                "Tamaño de equipo: " + nullable(prospect.getTeamSize()),
                "Estudiantes estimados: " + (prospect.getStudentCount() == null ? "No especificado" : prospect.getStudentCount()),
                "Servicio: " + nullable(prospect.getServiceInterest()),
                "Tecnología: " + nullable(prospect.getTechnologyInterest()),
                "Plan: " + nullable(prospect.getPlanId()),
                "Origen: " + nullable(prospect.getSource()),
                "",
                "Mensaje:",
                prospect.getMessage(),
                "",
                "Fecha: " + prospect.getCreatedAt()
        )));
        return message;
    }

    private SimpleMailMessage confirmationMessage(Prospect prospect) {
        SimpleMailMessage message = baseMessage();
        message.setTo(prospect.getEmail());
        message.setSubject("Recibimos tu solicitud - " + properties.mail().brandName());
        message.setText(String.join("\n", List.of(
                "Hola " + prospect.getFirstName() + ",",
                "",
                "Recibimos tu solicitud. El equipo de " + properties.mail().brandName() + " revisará la información y se pondrá en contacto contigo.",
                "",
                "Referencia: " + reference(prospect),
                "Tipo de solicitud: " + prospect.getRequestType(),
                "",
                "Este mensaje es una confirmación automática."
        )));
        return message;
    }

    private SimpleMailMessage baseMessage() {
        SimpleMailMessage message = new SimpleMailMessage();
        if (!properties.mail().from().isBlank()) message.setFrom(properties.mail().from());
        return message;
    }

    private String reference(Prospect prospect) {
        return "NS-" + String.format("%08d", prospect.getId());
    }

    private String fullName(Prospect prospect) {
        String lastName = prospect.getLastName() == null ? "" : prospect.getLastName();
        return (prospect.getFirstName() + " " + lastName).trim();
    }

    private String nullable(String value) {
        return value == null || value.isBlank() ? "No especificado" : value;
    }
}
