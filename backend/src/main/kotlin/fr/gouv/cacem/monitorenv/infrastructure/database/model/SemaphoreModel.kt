package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import org.locationtech.jts.geom.Point
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "semaphores")
data class SemaphoreModel(
  @Id
  @Column(name = "id")
  var id: Int,
  @Column(name = "geom")
  var geom: Point,
  @Column(name = "nom")
  var nom: String,
  @Column(name = "dept")
  var dept: String? = null,
  @Column(name = "facade")
  var facade: String? = null,
  @Column(name = "administration")
  var administration: String? = null,
  @Column(name = "unite")
  var unite: String? = null,
  @Column(name = "email")
  var email: String? = null,
  @Column(name = "telephone")
  var telephone: String? = null,
  @Column(name = "base")
  var base: String? = null
) {
  fun toSemaphore() = SemaphoreEntity(
    id = id,
    geom = geom,
    nom = nom,
    dept = dept,
    facade = facade,
    administration = administration,
    unite = unite,
    email = email,
    telephone = telephone,
    base = base
  )
}
