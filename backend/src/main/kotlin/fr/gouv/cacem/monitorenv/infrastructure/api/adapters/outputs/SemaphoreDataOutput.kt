package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import org.locationtech.jts.geom.Point

data class SemaphoreDataOutput(
  val id: Int,
  val geom: Point,
  val nom: String,
  val dept: String?,
  val facade: String?,
  val administration: String?,
  val unite: String?,
  val email: String?,
  val telephone: String?,
  val base: String?
) {
  companion object{
    fun fromSemaphoreEntity(semaphore: SemaphoreEntity) = SemaphoreDataOutput(
      id = semaphore.id,
      geom = semaphore.geom,
      nom = semaphore.nom,
      dept = semaphore.dept,
      facade = semaphore.facade,
      administration = semaphore.administration,
      unite = semaphore.unite,
      email = semaphore.email,
      telephone = semaphore.telephone,
      base = semaphore.base,
    )
  }
}
