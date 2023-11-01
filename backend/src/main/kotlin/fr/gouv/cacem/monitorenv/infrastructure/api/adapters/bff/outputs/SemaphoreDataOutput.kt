package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import org.locationtech.jts.geom.Point

data class SemaphoreDataOutput(
    val id: Int,
    val geom: Point,
    val name: String,
    val department: String?,
    val facade: String?,
    val administration: String?,
    val unit: String?,
    val email: String?,
    val phoneNumber: String?,
    val base: String?
) {
    companion object {
        fun fromSemaphoreEntity(semaphore: SemaphoreEntity) = SemaphoreDataOutput(
            id = semaphore.id,
            geom = semaphore.geom,
            name = semaphore.name,
            department = semaphore.department,
            facade = semaphore.facade,
            administration = semaphore.administration,
            unit = semaphore.unit,
            email = semaphore.email,
            phoneNumber = semaphore.phoneNumber,
            base = semaphore.base
        )
    }
}
