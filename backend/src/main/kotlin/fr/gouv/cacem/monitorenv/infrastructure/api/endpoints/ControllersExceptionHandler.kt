package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.BackendUsageErrorDataOutput
import io.sentry.Sentry
import org.locationtech.jts.io.ParseException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.Ordered.HIGHEST_PRECEDENCE
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
@Order(HIGHEST_PRECEDENCE)
class ControllersExceptionHandler(
    val sentryConfig: SentryConfig,
) {
    private val logger: Logger = LoggerFactory.getLogger(ControllersExceptionHandler::class.java)

    // -------------------------------------------------------------------------
    // Domain exceptions

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BackendUsageException::class)
    fun handleBackendUsageException(e: BackendUsageException): ResponseEntity<BackendUsageErrorDataOutput> {
        // Send catched exception without stack to Sentry. Stack should be visible using Kibana or any log visualization tool
        if (sentryConfig.enabled == true) {
            Sentry.captureException(e)
        }
        val status =
            when (e.code) {
                BackendUsageErrorCode.CHILD_ALREADY_ATTACHED,
                BackendUsageErrorCode.UNARCHIVED_CHILD,
                BackendUsageErrorCode.CANNOT_DELETE_ENTITY,
                BackendUsageErrorCode.UNVALID_PROPERTY,
                BackendUsageErrorCode.ENTITY_NOT_SAVED,
                -> HttpStatus.BAD_REQUEST

                BackendUsageErrorCode.ENTITY_NOT_FOUND -> HttpStatus.NOT_FOUND

                else -> HttpStatus.INTERNAL_SERVER_ERROR
            }

        val body =
            BackendUsageErrorDataOutput(
                code = e.code,
                data = e.data,
                message = null,
            )

        return ResponseEntity(body, status)
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ParseException::class)
    fun handleHttpMessageNotReadable(e: ParseException): BackendUsageErrorDataOutput {
        logger.error(e.message, e)
        return BackendUsageErrorDataOutput(
            code = BackendUsageErrorCode.UNVALID_PROPERTY,
            data = null,
            message = "Error: geometry is not valid",
        )
    }

    // -------------------------------------------------------------------------
    // Infrastructure and unhandled domain exceptions
    // - Unhandled domain exceptions are a bug, thus an unexpected exception.
    // - Infrastructure exceptions are not supposed to bubble up until here.
    //   They should be caught or transformed into domain exceptions.
    //   If that happens, it's a bug, thus an unexpected exception.

    /*     @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception::class)
    fun handleUnexpectedException(e: Exception): BackendInternalErrorDataOutput {
        logger.error(e.message, e)

        return BackendInternalErrorDataOutput()
    } */
}
