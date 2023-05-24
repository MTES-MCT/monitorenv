package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.MultiPolygon
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "amp_cacem")
data class AMPModel(
  @Id
  @Column(name = "id")
  var id: Int,
  @Column(name = "geom")
  var geom: MultiPolygon,
  @Column(name = "mpa_oriname")
  var mpaOriname: String,
  @Column(name = "des_desigfr")
  var desDesigfr: String,
) {
  fun toAMP() = AMPEntity(
    id = id,
    geom = geom,
    mpaOriname = mpaOriname,
    desDesigfr = desDesigfr
  )

}
