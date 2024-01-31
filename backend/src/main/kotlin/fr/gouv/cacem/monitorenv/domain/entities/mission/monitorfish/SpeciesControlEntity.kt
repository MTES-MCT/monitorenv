package fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish

import kotlinx.serialization.Serializable

@Serializable
class SpeciesControlEntity {
    var speciesCode: String? = null
    var nbFish: Double? = null
    var declaredWeight: Double? = null
    var controlledWeight: Double? = null
    var underSized: Boolean? = null
}
