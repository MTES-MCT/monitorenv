package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity

data class DepartmentAreaDataOutput(
    /** `inseeDep` is the ID. */
    val inseeDep: String,
    val name: String,
) {
    companion object {
        fun fromDepartmentArea(departmentArea: DepartmentAreaEntity): DepartmentAreaDataOutput {
            return DepartmentAreaDataOutput(
                inseeDep = departmentArea.inseeDep,
                name = departmentArea.name,
            )
        }
    }
}
