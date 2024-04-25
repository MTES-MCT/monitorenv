package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions

/**
 * Exception to throw when any error occurs in the infrastructure layer.
 *
 * This exception should be caught and handled in the domain layer, likely by a use case.
 */
class InfrastructureException(code: InfrastructureErrorCode, message: String) : RuntimeException(message)
