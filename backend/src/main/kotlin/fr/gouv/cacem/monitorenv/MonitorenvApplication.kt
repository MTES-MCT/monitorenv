package fr.gouv.cacem.monitorenv

import io.sentry.Sentry
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication


@SpringBootApplication
class MonitorenvApplication

fun main(args: Array<String>) {

    val ctx = runApplication<MonitorenvApplication>(*args)

    val isSentryEnabled: String? = ctx.environment.getProperty("monitorenv.sentry.enabled")

    if (isSentryEnabled == "true") {
        Sentry.init { options ->
            options.dsn = ctx.environment.getProperty("monitorenv.sentry.dsn")
            options.environment = ctx.environment.getProperty("monitorenv.sentry.environment")
            options.release = ctx.environment.getProperty("monitorenv.version")
            // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            options.tracesSampleRate = 1.0
        }
    }
}
