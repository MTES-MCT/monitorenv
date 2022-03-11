package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "monitorenv.ajp")
class AJPProperties {
    var port: String? = null
}