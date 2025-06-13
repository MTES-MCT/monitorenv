package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendInternalException
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.*
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestErrorCode
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestException
import io.sentry.Sentry
import org.locationtech.jts.io.ParseException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.Ordered.HIGHEST_PRECEDENCE
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.util.regex.Pattern

@RestControllerAdvice
@Order(HIGHEST_PRECEDENCE)
class ControllersExceptionHandler(
    val sentryConfig: SentryConfig,
) {
    private val logger: Logger = LoggerFactory.getLogger(ControllersExceptionHandler::class.java)

    // -------------------------------------------------------------------------
    // Domain exceptions

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(BackendInternalException::class)
    fun handleBackendInternalException(e: BackendInternalException): BackendInternalErrorDataOutput =
        BackendInternalErrorDataOutput()

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ExceptionHandler(BackendRequestException::class)
    fun handleBackendRequestException(e: BackendRequestException): BackendRequestErrorDataOutput =
        BackendRequestErrorDataOutput(code = e.code, data = e.data, message = e.message)

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BackendUsageException::class)
    fun handleBackendUsageException(e: BackendUsageException): BackendUsageErrorDataOutput {
        logger.error(e.message)
        return BackendUsageErrorDataOutput(code = e.code, data = e.data, message = null)
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleHttpMessageNotReadable(e: HttpMessageNotReadableException): BackendRequestErrorDataOutput {
        val errorMessage = e.message ?: "Unknown error occurred"
        val field = extractFieldFromErrorMessage(errorMessage)
        return BackendRequestErrorDataOutput(
            code = BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
            data = null,
            message = "Error: Invalid value in field '$field', $errorMessage",
        )
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ParseException::class)
    fun handleHttpMessageNotReadable(e: ParseException): BackendRequestErrorDataOutput =
        BackendRequestErrorDataOutput(
            code = BackendRequestErrorCode.WRONG_REQUEST_PARAM_PROPERTY_TYPE,
            data = null,
            message = "Error: geometry is not valid",
        )

    private fun extractFieldFromErrorMessage(errorMessage: String): String {
        val pattern = Pattern.compile("\"(.*?)\"")
        val matcher = pattern.matcher(errorMessage)
        return if (matcher.matches()) {
            matcher.group(1)
        } else {
            "Unknown field"
        }
    }

    // -------------------------------------------------------------------------
    // Legacy exceptions

    // TODO Migrate to new error handling logic.
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(e: Exception): ApiError {
        logger.error(e.message, e)

        if (sentryConfig.enabled == true) {
            Sentry.captureException(e)
        }

        return ApiError(IllegalArgumentException(e.message.toString(), e))
    }

    // TODO Migrate to new error handling logic.
    // Which cases does this exception cover?
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(NoSuchElementException::class)
    fun handleNoSuchElementException(e: Exception): ApiError {
        logger.error(e.message, e)

        if (sentryConfig.enabled == true) {
            Sentry.captureException(e)
        }

        return ApiError(NoSuchElementException(e.message.toString(), e))
    }

    // TODO Migrate to new error handling logic.
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MissingServletRequestParameterException::class)
    fun handleNoParameter(e: MissingServletRequestParameterException): MissingParameterApiError {
        logger.error(e.message, e)

        if (sentryConfig.enabled == true) {
            Sentry.captureException(e)
        }

        return MissingParameterApiError("Parameter \"${e.parameterName}\" is missing.")
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
