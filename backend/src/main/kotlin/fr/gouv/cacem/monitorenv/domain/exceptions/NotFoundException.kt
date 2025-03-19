package fr.gouv.cacem.monitorenv.domain.exceptions

@Deprecated("Use `BackendUsageException` instead.")
class NotFoundException(
    message: String,
    cause: Throwable? = null,
) : Throwable(message, cause)
