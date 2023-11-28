package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.config.SentryConfig
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SentryTestController(val sentryConfig: SentryConfig) {
    private val logger: Logger = LoggerFactory.getLogger(SentryTestController::class.java)

    // This route is for testing purpose only
    // Used to test that errors are correctly sent to sentry
    @GetMapping("/test/trigger_sentry_error")
    fun triggerError(): String {
        try {
            throw Exception("Sentry error triggered from get request")
        } catch (e: Exception) {
            logger.error(e.message, e)
        }
        // return string "sentry config status: enabled"
        return "sentry config status: ${sentryConfig.enabled}"
    }
}
