package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity

data class DepartmentAreaDataOutput(
    /** `inseeCode` is the ID. */
    val inseeCode: String,
    val name: String,
) {
    companion object {
        fun fromDepartmentArea(departmentArea: DepartmentAreaEntity): DepartmentAreaDataOutput =
            DepartmentAreaDataOutput(
                inseeCode = departmentArea.inseeCode,
                name = departmentArea.name,
            )
    }
}
