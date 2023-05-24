package fr.gouv.cacem.monitorenv.domain.entities.amp

import org.locationtech.jts.geom.MultiPolygon

data class AMPEntity(
  val id: Int,
  val geom: MultiPolygon,
  val mpaOriname: String,
  val desDesigfr: String
)
