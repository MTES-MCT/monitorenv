package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "monitorenv.oidc")
class OIDCProperties {
    var enabled: Boolean? = false
    var userinfoEndpoint: String? = null
    var issuerUri: String? = null
    var cacheInMinutes: Int = 120
}
