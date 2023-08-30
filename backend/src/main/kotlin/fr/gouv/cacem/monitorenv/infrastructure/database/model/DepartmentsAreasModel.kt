package fr.gouv.cacem.monitorenv.infrastructure.database.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.MultiPolygon

@Table(name = "departments_areas")
@Entity
data class DepartmentsAreasModel(
    @Id
    @Column(name = "insee_dep")
    val inseeDep: String,

    @Column(name = "name")
    val name: String,

    @Column(name = "geometry")
    val geometry: MultiPolygon? = null,
)
