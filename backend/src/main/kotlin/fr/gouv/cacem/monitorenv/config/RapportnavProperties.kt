package fr.gouv.cacem.monitorenv.config
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "rapportnav")
class RapportnavProperties {
    var url: String = ""
}
