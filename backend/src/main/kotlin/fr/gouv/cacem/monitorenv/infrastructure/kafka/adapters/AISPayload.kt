package fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters

import java.time.ZonedDateTime

class AISPayload(
    val coord: String?,
    val course: Double?,
    val features: Feature?,
    val heading: Double?,
    val mmsi: Int?,
    val speed: Double?,
    val status: String?,
    val ts: ZonedDateTime?,
)
