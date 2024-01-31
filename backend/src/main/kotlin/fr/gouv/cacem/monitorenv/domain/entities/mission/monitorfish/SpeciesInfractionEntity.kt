package fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish

import kotlinx.serialization.Serializable

@Serializable
class SpeciesInfractionEntity {
    var infractionType: InfractionTypeEnum? = null
    var natinf: Int? = null
    var comments: String? = null
}
