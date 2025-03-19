package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.MultiPolygon

@Table(name = "departments_areas")
@Entity
data class DepartmentAreaModel(
    @Id
    @Column(name = "insee_dep", nullable = false, unique = true)
    val inseeCode: String,
    @Column(name = "geometry")
    val geometry: MultiPolygon? = null,
    @Column(name = "name", nullable = false)
    val name: String,
) {
    companion object {
        fun fromDepartmentArea(departmentArea: DepartmentAreaEntity): DepartmentAreaModel =
            DepartmentAreaModel(
                inseeCode = departmentArea.inseeCode,
                geometry = departmentArea.geometry,
                name = departmentArea.name,
            )
    }

    fun toDepartmentArea(): DepartmentAreaEntity =
        DepartmentAreaEntity(
            inseeCode,
            geometry,
            name,
        )

    @Override
    override fun toString(): String =
        this::class.simpleName + "(inseeCode = $inseeCode , geometry = geometry , name = $name)"
}
