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
    var inseeDep: String,

    @Column(name = "name")
    var name: String,

    @Column(name = "geometry")
    var geometry: MultiPolygon? = null,
)
