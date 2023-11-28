package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.config.SentryConfig
import io.sentry.Sentry
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SentryTestController(val sentryConfig: SentryConfig) {

    // This route is for testing purpose only
    // Used to test that errors are correctly sent to sentry
    @GetMapping("/test/trigger_sentry_error")
    fun triggerError() {
        if (sentryConfig.enabled == true) {
            Sentry.captureException(throw Exception("Sentry error triggered from get request"))
        }
    }
}
