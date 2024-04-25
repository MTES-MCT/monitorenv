package fr.gouv.cacem.monitorenv.domain.exceptions

@Deprecated("Use `BackendInternalException` or `BackendRequestException` instead (depending on the case).")
class EntityConversionException(message: String, cause: Throwable? = null) :
    Throwable(message, cause)
