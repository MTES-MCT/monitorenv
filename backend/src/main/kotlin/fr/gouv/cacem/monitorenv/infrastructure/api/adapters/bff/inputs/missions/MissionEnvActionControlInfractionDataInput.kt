package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.AdministrativeResponseEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.SeizureTypeEnum

data class MissionEnvActionControlInfractionDataInput(
    val id: String,
    val administrativeResponse: AdministrativeResponseEnum,
    val companyName: String? = null,
    val controlledPersonIdentity: String? = null,
    val formalNotice: FormalNoticeEnum,
    val imo: String? = null,
    val infractionType: InfractionTypeEnum,
    val mmsi: String? = null,
    val natinf: List<String>? = listOf(),
    val nbTarget: Int,
    val observations: String? = null,
    val registrationNumber: String? = null,
    val seizure: SeizureTypeEnum,
    val vesselId: Int? = null,
    val vesselName: String? = null,
    val vesselType: String? = null,
    val vesselSize: Number? = null,
) {
    fun toInfractionEntity() =
        InfractionEntity(
            id = id,
            administrativeResponse = administrativeResponse,
            companyName = companyName,
            controlledPersonIdentity = controlledPersonIdentity,
            formalNotice = formalNotice,
            imo = imo,
            infractionType = infractionType,
            mmsi = mmsi,
            natinf = natinf,
            nbTarget = nbTarget,
            observations = observations,
            registrationNumber = registrationNumber,
            seizure = seizure,
            vesselId = vesselId,
            vesselName = vesselName,
            vesselType = vesselType,
            vesselSize = vesselSize,
        )
}
