package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import org.springframework.boot.info.BuildProperties
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class Version(
    val buildProperties: BuildProperties,
) {
    @GetMapping("/version")
    fun version(): Map<String, String> =
        mapOf(
            "version" to buildProperties.version,
            "commit" to buildProperties.get("commit.hash"),
        )
}
