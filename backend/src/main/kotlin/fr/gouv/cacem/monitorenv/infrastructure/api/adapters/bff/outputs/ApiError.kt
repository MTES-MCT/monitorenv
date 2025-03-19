package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

@Deprecated(
    "Use either `BackendInternalErrorDataOutput`, `BackendRequestErrorDataOutput` or `BackendUsageErrorDataOutput` instead.",
)
class ApiError(
    val type: String,
) {
    constructor(exception: Throwable) : this(
        exception.cause
            ?.javaClass
            ?.simpleName
            .toString(),
    )
}
