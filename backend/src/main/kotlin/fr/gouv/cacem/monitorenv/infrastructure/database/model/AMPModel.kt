package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.MultiPolygon

@Entity
@Table(name = "amp_cacem")
data class AMPModel(
    @Id
    @Column(name = "id")
    val id: Int,
    @Column(name = "geom")
    val geom: MultiPolygon,
    @Column(name = "mpa_oriname")
    val name: String,
    @Column(name = "des_desigfr")
    val designation: String,
    @Column(name = "mpa_type")
    val type: String
) {
    fun toAMP() = AMPEntity(
        id = id,
        geom = geom,
        name = name,
        designation = designation,
        type = type
    )
}
