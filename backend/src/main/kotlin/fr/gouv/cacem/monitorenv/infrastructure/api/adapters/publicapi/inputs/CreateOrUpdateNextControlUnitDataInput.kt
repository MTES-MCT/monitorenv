package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity

data class CreateOrUpdateNextControlUnitDataInput(
    val id: Int? = null,
    val administrationId: Int,
    val controlUnitContactIds: List<Int>,
    val controlUnitResourceIds: List<Int>,
    val areaNote: String? = null,
    val isArchived: Boolean,
    val name: String,
    val termsNote: String? = null,
) {
    fun toNextControlUnitEntity(
    ): NextControlUnitEntity {
        return NextControlUnitEntity(
            id = this.id,
            areaNote = this.areaNote,
            administrationId = this.administrationId,
            controlUnitContactIds = this.controlUnitContactIds,
            controlUnitResourceIds = this.controlUnitResourceIds,
            isArchived = this.isArchived,
            name = this.name,
            termsNote = this.termsNote,
        )
    }
}
