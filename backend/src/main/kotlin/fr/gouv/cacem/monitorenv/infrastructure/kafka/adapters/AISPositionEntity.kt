package fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters

import java.time.ZonedDateTime

class AISPositionEntity(
    val id: Int? = null,
    val mmsi: Int?,
    val coord: String?,
    val status: String?,
    val course: Double?,
    val heading: Double?,
    val speed: Double?,
    val ts: ZonedDateTime?,
)
