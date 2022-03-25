package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity

import java.time.ZonedDateTime

data class RegulatoryAreaDataOutput(
    val id: Int,
    val typeOperation: String? = null,
    val statusOperation: String? = null,
    val facade: String? = null,
    val theme: String? = null,
    val inputStartDatetimeUtc: ZonedDateTime? = null,
    val inputEndDatetimeUtc: ZonedDateTime? = null,
    val longitude: Double? = null,
    val latitude: Double? = null) {
    companion object {
        fun fromOperation(operation: OperationEntity) = RegulatoryAreaDataOutput(
            id = operation.id,
            typeOperation = operation.typeOperation,
            statusOperation = operation.statusOperation,
            facade = operation.facade,
            theme = operation.theme,
            inputStartDatetimeUtc = operation.inputStartDatetimeUtc,
            inputEndDatetimeUtc = operation.inputEndDatetimeUtc,
            longitude = operation.longitude,
            latitude = operation.latitude,
        )
    }
}
