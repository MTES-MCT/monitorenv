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
    val id: Int,

    @Column(name = "facade")
    val facade: String,

    @Column(name = "geometry")
    val geometry: MultiPolygon? = null
)
