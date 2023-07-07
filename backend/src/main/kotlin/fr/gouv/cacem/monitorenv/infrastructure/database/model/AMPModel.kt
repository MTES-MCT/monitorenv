package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.MultiPolygon
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "amp_cacem")
data class AMPModel(
    @Id
    @Column(name = "id")
    var id: Int,
    @Column(name = "geom")
    var geom: MultiPolygon,
    @Column(name = "mpa_oriname")
    var name: String,
    @Column(name = "des_desigfr")
    var designation: String,
    @Column(name = "mpa_type")
    var type: String,
) {
    fun toAMP() = AMPEntity(
        id = id,
        geom = geom,
        name = name,
        designation = designation,
        type = type,
    )
}
