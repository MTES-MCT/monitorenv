package fr.gouv.cacem.monitorenv.domain.exceptions

@Deprecated("Use `BackendUsageException` with the right code instead (depending on the case).")
class EntityConversionException(
    message: String,
    cause: Throwable? = null,
) : Throwable(message, cause)
