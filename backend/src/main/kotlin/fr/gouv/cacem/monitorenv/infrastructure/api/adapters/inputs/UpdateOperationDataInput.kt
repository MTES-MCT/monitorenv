package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity
import java.time.ZonedDateTime

data class UpdateOperationDataInput(
    val id: Int,
    val typeOperation: String? = null,
    val statusOperation: String? = null,
    val facade: String? = null,
    val theme: String? = null,
    val inputStartDatetimeUtc: ZonedDateTime? = null,
    val inputEndDatetimeUtc: ZonedDateTime? = null,
    val longitude: Double? = null,
    val latitude: Double? = null,
) {
    fun toOperationEntity() :OperationEntity {
        return OperationEntity(
            id= this.id,
            typeOperation = this.typeOperation,
            statusOperation = this.statusOperation,
            facade = this.facade,
            theme = this.theme,
            inputStartDatetimeUtc = this.inputStartDatetimeUtc,
            inputEndDatetimeUtc = this.inputEndDatetimeUtc,
            longitude = this.longitude,
            latitude = this.latitude,
        )
    }
}
