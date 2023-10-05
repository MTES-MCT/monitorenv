package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

import fr.gouv.cacem.monitorenv.domain.entities.SeaFront

data class ControlUnitEntity(
    val id: Int? = null,
    val administrationId: Int,
    /** Area of intervention for this unit. */
    val areaNote: String? = null,
    val department: String,
    val isArchived: Boolean,
    val name: String,
    val seaFront: SeaFront,
    /** Conditions under which this unit should be contacted. */
    val termsNote: String? = null,
)
