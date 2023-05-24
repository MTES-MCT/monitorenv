package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.Point

@Entity
@Table(name = "semaphores")
data class SemaphoreModel(
    @Id
    @Column(name = "id")
    var id: Int,
    @Column(name = "geom")
    var geom: Point,
    @Column(name = "nom")
    var name: String,
    @Column(name = "dept")
    var department: String? = null,
    @Column(name = "facade")
    var facade: String? = null,
    @Column(name = "administration")
    var administration: String? = null,
    @Column(name = "unite")
    var unit: String? = null,
    @Column(name = "email")
    var email: String? = null,
    @Column(name = "telephone")
    var phoneNumber: String? = null,
    @Column(name = "base")
    var base: String? = null,
) {
    fun toSemaphore() = SemaphoreEntity(
        id = id,
        geom = geom,
        name = name,
        department = department,
        facade = facade,
        administration = administration,
        unit = unit,
        email = email,
        phoneNumber = phoneNumber,
        base = base,
    )
}
