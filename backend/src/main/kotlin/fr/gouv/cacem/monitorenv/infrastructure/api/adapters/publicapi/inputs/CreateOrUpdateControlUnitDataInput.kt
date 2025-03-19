package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity

data class CreateOrUpdateControlUnitDataInput(
    val id: Int? = null,
    val administrationId: Int,
    val areaNote: String? = null,
    val departmentAreaInseeCode: String? = null,
    val isArchived: Boolean,
    val name: String,
    val termsNote: String? = null,
) {
    fun toControlUnit(): ControlUnitEntity =
        ControlUnitEntity(
            id = this.id,
            areaNote = this.areaNote,
            administrationId = this.administrationId,
            departmentAreaInseeCode = this.departmentAreaInseeCode,
            isArchived = this.isArchived,
            name = this.name,
            termsNote = this.termsNote,
        )
}
