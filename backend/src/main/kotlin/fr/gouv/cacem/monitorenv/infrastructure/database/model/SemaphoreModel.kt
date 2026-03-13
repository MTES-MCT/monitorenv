package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
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
    val id: Int,
    @Column(name = "geom", nullable = false) val geom: Point,
    @Column(name = "nom", nullable = false) val name: String,
    @Column(name = "dept") val department: String? = null,
    @Column(name = "facade") val facade: String? = null,
    @Column(name = "administration") val administration: String? = null,
    @Column(name = "unite") val unit: String? = null,
    @Column(name = "email") val email: String? = null,
    @Column(name = "telephone") val phoneNumber: String? = null,
    @Column(name = "base") val base: String? = null,
    @Column(name = "url") val url: String? = null,
) {
    fun toSemaphore() =
        SemaphoreEntity(
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
            url = url,
        )
}
