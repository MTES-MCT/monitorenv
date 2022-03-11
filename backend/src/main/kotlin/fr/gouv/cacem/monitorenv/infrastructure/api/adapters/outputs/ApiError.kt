package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

class ApiError(val error: String, val type: String) {
    constructor(exception: Throwable) : this(exception.cause?.message ?: "", exception.cause?.javaClass?.simpleName.toString())
}
