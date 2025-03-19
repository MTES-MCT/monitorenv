package fr.gouv.cacem.monitorenv.domain.exceptions

/** Thrown when attempting to attach a reporting already attached to a mission. */
@Deprecated("Use `BackendUsageException` instead.")
class ReportingAlreadyAttachedException(
    message: String,
) : RuntimeException(message)
