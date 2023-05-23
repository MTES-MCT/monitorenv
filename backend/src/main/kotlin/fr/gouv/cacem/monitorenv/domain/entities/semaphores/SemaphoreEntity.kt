package fr.gouv.cacem.monitorenv.domain.entities.semaphores

import org.locationtech.jts.geom.Point

data class SemaphoreEntity(
  val id: Int,
  val geom: Point,
  val nom: String,
  val dept: String? = null,
  val facade: String? = null,
  val administration: String? = null,
  val unite: String? = null,
  val email: String? = null,
  val telephone: String? = null,
  val base: String? = null
)
