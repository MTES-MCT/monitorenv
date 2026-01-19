package fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters

import java.time.ZonedDateTime

class AISMessage(
    val imo: String?,
    val callsign: String?,
    val shipname: String?,
    val shiptype: Int?,
    val toBow: Double?,
    val toStern: Double?,
    val toPort: Double?,
    val toStarboard: Double?,
    val draught: Double?,
    val destination: String?,
    val ts: ZonedDateTime?,
)
