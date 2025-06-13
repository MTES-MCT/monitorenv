package fr.gouv.cacem.monitorenv.domain.exceptions

import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * Domain exception to throw when an internal error occurred in the backend.
 *
 * ## Examples
 * - An unexpected exception has been caught.
 *
 * ## Logging
 * This exception is logged as an error on the Backend side.
 */
open class BackendInternalException(
    final override val message: String,
    originalException: Exception? = null,
) : RuntimeException(message) {
    private val logger: Logger = LoggerFactory.getLogger(BackendInternalException::class.java)

    init {
        logger.error("BackendInternalException: $message")
        originalException?.let { logger.error("${it::class.simpleName}: ${it.message}") }
    }
}
