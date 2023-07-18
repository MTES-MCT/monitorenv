package fr.gouv.cacem.monitorenv.infrastructure.api

import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ApiError
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.MissingParameterApiError
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
import java.lang.IllegalArgumentException

@RestControllerAdvice
@Order(HIGHEST_PRECEDENCE)
class ControllersExceptionHandler {
    private val logger: Logger = LoggerFactory.getLogger(ControllersExceptionHandler::class.java)

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(e: Exception): ApiError {
        logger.error(e.message, e.cause)
        return ApiError(IllegalArgumentException(e.message.toString(), e))
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MissingServletRequestParameterException::class)
    fun handleNoParameter(e: MissingServletRequestParameterException): MissingParameterApiError {
        logger.error(e.message, e.cause)
        return MissingParameterApiError("Parameter \"${e.parameterName}\" is missing.")
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleNoParameter(e: HttpMessageNotReadableException): ApiError {
        logger.error(e.message, e.cause)
        return ApiError(e)
    }
}
