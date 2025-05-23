package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "monitorenv.brief")
class EditableBriefProperties {
    lateinit var templatePath: String
    lateinit var tmpDocxPath: String
    lateinit var tmpOdtPath: String
}
