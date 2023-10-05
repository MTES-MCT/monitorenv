package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.SeaFront
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity

data class CreateOrUpdateControlUnitDataInput(
    val id: Int? = null,
    val administrationId: Int,
    val areaNote: String? = null,
    val department: String,
    val isArchived: Boolean,
    val name: String,
    val seaFront: SeaFront,
    val termsNote: String? = null,
) {
    fun toControlUnit(
    ): ControlUnitEntity {
        return ControlUnitEntity(
            id = this.id,
            areaNote = this.areaNote,
            administrationId = this.administrationId,
            department = this.department,
            isArchived = this.isArchived,
            name = this.name,
            seaFront = this.seaFront,
            termsNote = this.termsNote,
        )
    }
}
