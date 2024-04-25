package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode

/**
 * Error output to use when the request is valid but the backend cannot process it.
 *
 * It's called "usage" because this request likely comes from an end-user action that's no longer valid
 * which happens when their client data is not up-to-date with the backend.
 *
 * ## Examples
 * - A user tries to create a resource that has already been created.
 * - A user tries to delete a resource that doesn't exist anymore.
 *
 * ## Logging
 * The related exception is NOT logged on the Backend side.
 * It should NOT be logged on the Frontend side,
 * it should rather display a comprehensible error message to the end-user.
 */
data class BackendUsageErrorDataOutput(
    val code: BackendUsageErrorCode,
    val data: Any? = null,
    val message: String? = null,
)
