package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity

import java.time.ZonedDateTime

data class OperationDataOutput(
    val id: Int,
    val typeOperation: String? = null,
    val statutOperation: String? = null,
    val facade: String? = null,
    val thematique: String? = null,
    val inputStartDatetimeUtc: ZonedDateTime? = null,
    val inputEndDatetimeUtc: ZonedDateTime? = null,
    val longitude: Double? = null,
    val latitude: Double? = null) {
    companion object {
        fun fromOperation(operation: OperationEntity) = OperationDataOutput(
            id = operation.id,
            typeOperation = operation.typeOperation,
            statutOperation = operation.statutOperation,
            facade = operation.facade,
            thematique = operation.thematique,
            inputStartDatetimeUtc = operation.inputStartDatetimeUtc,
            inputEndDatetimeUtc = operation.inputEndDatetimeUtc,
            longitude = operation.longitude,
            latitude = operation.latitude,
        )
    }
}
