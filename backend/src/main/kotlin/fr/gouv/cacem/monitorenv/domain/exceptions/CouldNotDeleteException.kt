package fr.gouv.cacem.monitorenv.domain.exceptions

@Deprecated("Use `BackendUsageException` instead.")
class CouldNotDeleteException(
    message: String,
) : RuntimeException(message)
