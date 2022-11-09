package fr.gouv.cacem.monitorenv.infrastructure.database.model

import org.locationtech.jts.geom.MultiPolygon
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Table(name = "facade_areas_subdivided")
@Entity
data class FacadeAreasModel(
    @Id
    @Column(name = "id")
    var id: Int,

    @Column(name = "facade")
    var facade: String,

    @Column(name = "geometry")
    var geometry: MultiPolygon? = null
)
