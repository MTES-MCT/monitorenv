package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

class ApiError(val type: String) {
    constructor(exception: Throwable) : this(exception.cause?.javaClass?.simpleName.toString())
}
