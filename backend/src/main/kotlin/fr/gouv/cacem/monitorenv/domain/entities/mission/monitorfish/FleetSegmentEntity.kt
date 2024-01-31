package fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish

import kotlinx.serialization.Serializable

@Serializable
data class FleetSegmentEntity(
    var segment: String? = null,
    var segmentName: String? = null,
)
