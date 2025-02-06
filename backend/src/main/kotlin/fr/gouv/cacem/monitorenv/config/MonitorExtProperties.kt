package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "monitorenv.ext")
class MonitorExtProperties {
    var id: String = ""
    var password: String = ""
}
