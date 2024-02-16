package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.VesselTypeEnum

data class MissionEnvActionControlInfractionDataInput(
    val id: String,
    val natinf: List<String>? = listOf(),
    val observations: String? = null,
    val registrationNumber: String? = null,
    val companyName: String? = null,
    val relevantCourt: String? = null,
    val infractionType: InfractionTypeEnum,
    val formalNotice: FormalNoticeEnum,
    val toProcess: Boolean,
    val controlledPersonIdentity: String? = null,
    val vesselType: VesselTypeEnum? = null,
    val vesselSize: Number? = null,
) {
    fun toInfractionEntity() =
        InfractionEntity(
            id = id,
            natinf = natinf,
            observations = observations,
            registrationNumber = registrationNumber,
            companyName = companyName,
            relevantCourt = relevantCourt,
            infractionType = infractionType,
            formalNotice = formalNotice,
            toProcess = toProcess,
            controlledPersonIdentity = controlledPersonIdentity,
            vesselType = vesselType,
            vesselSize = vesselSize,
        )
}
