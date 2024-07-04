package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "monitorenv.api.super-user")
data class SuperUserAPIProperties(
    var paths: List<String>? = listOf(),
)
