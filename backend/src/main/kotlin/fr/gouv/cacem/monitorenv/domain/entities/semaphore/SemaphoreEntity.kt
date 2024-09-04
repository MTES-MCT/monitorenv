package fr.gouv.cacem.monitorenv.domain.entities.semaphore

import org.locationtech.jts.geom.Point

data class SemaphoreEntity(
    val id: Int,
    val geom: Point,
    val name: String,
    val department: String? = null,
    val facade: String? = null,
    val administration: String? = null,
    val unit: String? = null,
    val email: String? = null,
    val phoneNumber: String? = null,
    val base: String? = null,
    val url: String? = null,
)
