package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "monitorenv.oidc")
class OIDCProperties {
    var enabled: Boolean? = false
    var clientId: String = ""
    var clientSecret: String = ""
    var redirectUri: String = ""
    var loginUrl: String = ""
    var successUrl: String = ""
    var errorUrl: String = ""
    var authorizedSirets: List<String> = listOf()
    var issuerUri: String = ""
    var authorizationUri: String = ""
    var tokenUri: String = ""
    var userInfoUri: String = ""
    var jwkSetUri: String = ""
}
