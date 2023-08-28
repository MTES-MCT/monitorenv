package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity

data class FullControlUnitContactDTO(
    val id: Int? = null,
    val controlUnit: ControlUnitEntity,
    val controlUnitId: Int,
    val email: String? = null,
    val name: String,
    val note: String? = null,
    val phone: String? = null
) {
    fun toControlUnitContact(): ControlUnitContactEntity {
        return ControlUnitContactEntity(
            id,
            controlUnitId,
            email,
            name,
            note,
            phone,
        )
    }
}
