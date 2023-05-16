package fr.gouv.cacem.monitorenv.infrastructure.database.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.MultiPolygon

@Table(name = "facade_areas_subdivided")
@Entity
data class FacadeAreasModel(
    @Id
    @Column(name = "id")
    var id: Int,

    @Column(name = "facade")
    var facade: String,

    @Column(name = "geometry")
    var geometry: MultiPolygon? = null,
)
