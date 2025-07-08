package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "monitorenv.oidc")
class OIDCProperties {
    var enabled: Boolean? = false
    var cacheInMinutes: Int = 120
    var loginUrl: String = ""
    var successUrl: String = ""
    var errorUrl: String = ""
    var authorizedSirets: List<String> = listOf()
}
