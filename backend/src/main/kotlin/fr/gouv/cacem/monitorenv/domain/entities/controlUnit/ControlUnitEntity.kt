package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity

data class ControlUnitEntity(
    val id: Int? = null,
    val administrationId: Int?,
    val administration: AdministrationEntity?,
    /** Area of intervention for this unit. */
    val areaNote: String? = null,
    val contact: String? = null,
    /** `departmentAreaInseeCode` is the `departmentArea` ID. */
    val departmentAreaInseeCode: String? = null,
    val isArchived: Boolean,
    val name: String,
    /** Conditions under which this unit should be contacted. */
    val termsNote: String? = null,
)
