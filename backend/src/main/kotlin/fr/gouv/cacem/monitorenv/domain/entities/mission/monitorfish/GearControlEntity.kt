package fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish

import kotlinx.serialization.Serializable

@Serializable
class GearControlEntity {
    var gearCode: String? = null
    var gearName: String? = null
    var declaredMesh: Double? = null
    var controlledMesh: Double? = null
    var hasUncontrolledMesh: Boolean = false
    var gearWasControlled: Boolean? = null
    var comments: String? = null
}
