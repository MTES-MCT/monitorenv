package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "monitorfish")
class MonitorfishProperties {
    var url: String = ""
    var xApiKey: String = ""
}
