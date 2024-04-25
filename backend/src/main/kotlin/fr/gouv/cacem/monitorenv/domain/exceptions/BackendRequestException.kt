package fr.gouv.cacem.monitorenv.domain.exceptions

import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * Domain exception to throw when a request is invalid.
 *
 * ## Examples
 * - The request has missing or wrongly-typed properties.
 * - The request has valid properties but is made of illogical data.
 *
 * ## Logging
 * This exception is logged as a warning on the Backend side in order to track any unexpected behavior.
 * It should definitely be logged on the Frontend side as an error.
 *
 * ## ⚠️ Important
 * **Don't forget to mirror any update here in the corresponding Frontend enum.**
 */
open class BackendRequestException(
    val code: BackendRequestErrorCode,
    final override val message: String? = null,
    val data: Any? = null,
) : Throwable(code.name) {
    private val logger: Logger = LoggerFactory.getLogger(BackendRequestException::class.java)

    init {
        logger.warn("$code: ${message ?: "No message."}")
    }
}
